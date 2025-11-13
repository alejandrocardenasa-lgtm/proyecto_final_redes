# Proyecto Final – Scrappeerfume Store
Autores: Alejandro Cardenas anturi – Santiago Uribe Londono
Universidad Autónoma de Occidente – 2025

1. Introducción

Este proyecto implementa una arquitectura completa basada en microservicios, utilizando Docker Swarm como orquestador de contenedores, HAProxy como balanceador y enrutador central, Nginx como servidor estático para el frontend, MariaDB como motor de base de datos y Apache JMeter para la ejecución de pruebas de carga, rendimiento y validación de escalabilidad horizontal (réplicas) sobre los microservicios del sistema.

El sistema está distribuido entre tres nodos virtualizados con Vagrant sobre una red privada 192.168.100.0/24.

El objetivo es lograr un entorno distribuido, estable y escalable, con separación de responsabilidades por nodo y comunicación a través de una red overlay.

2. Arquitectura General
   
Nodo 1 (servidorUbuntu1)

Bases de datos MariaDB:

usuariosdb

comprasdb

enviosdb

perfumesdb

pqrsdb

Nodo 2 (servidorUbuntu2)

Balanceador HAProxy

Frontend (Nginx)

Nodo 3 (servidorUbuntu3)

Microservicios Node.js:

Usuarios (3001)

PQRS (3002)

Compras (3003)

Envíos (3004)

Perfumes (4000)

Red interna
proyecto_final_net     (overlay)
Todos los servicios se comunican únicamente dentro del Swarm mediante esta red.

3. Requisitos Previos

Instalar Docker y el plugin de compose en cada nodo:

sudo apt update
sudo apt install docker.io docker-compose-plugin -y
sudo usermod -aG docker vagrant


Inicializar Docker Swarm en el nodo 2:

docker swarm init --advertise-addr 192.168.100.3


Obtener el token que aparece en consola e ingresarlo en los nodos 1 y 3:

docker swarm join --token <token> 192.168.100.3:2377

4. Crear la red Overlay

Esta red se crea una sola vez:

docker network create --driver overlay proyecto_final_net

Nunca debe eliminarse mientras el stack esté activo.

5. Estructura del Proyecto
proyecto_final/
├── docker-swarm.yml
├── frontend_scrapperfumestore/
│   ├── index.html
│   └── Dockerfile
│
├── haproxy/
│   ├── Dockerfile
│   └── haproxy.cfg
│
├── microservicios_usuarios/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── src.usuarios/
│       ├── index.js
│       ├── controllers/
│       │   └── usuariosController.js
│       └── models/
│           └── usuariosModel.js
│
├── microservicios_compras/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── src.compras/
│       ├── index.js
│       ├── controllers/
│       └── models/
│
├── microservicios_envios/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── src.envios/
│       ├── index.js
│       ├── controllers/
│       └── models/
│
├── microservicios_perfumes/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── src.perfumes/
│       ├── index.js
│       ├── controllers/
│       └── models/
│
└── microservicios_pqrs/
    ├── package.json
    ├── package-lock.json
    ├── Dockerfile
    └── src.pqrs/
        ├── index.js
        ├── controllers/
        └── models/


6. HAProxy

Imagen estable utilizada:

gonoalejo/haproxy:superstable2

Dockerfile:
FROM haproxy:2.8
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg", "-db"]

7. Despliegue del Stack Completo

En el nodo 2:

cd proyecto_final
docker stack deploy -c docker-swarm.yml proyecto_final


Ver servicios:

docker stack services proyecto_final


Ver replicas:

docker service ps <nombredelservicio>

8. Actualizar un Microservicio (Rolling Update)

Ejemplo con microservicio Usuarios:

Construir imagen:

docker build -t gonoalejo/microservicios_usuarios:v2 .


Enviar a Docker Hub:

docker push gonoalejo/microservicios_usuarios:v2


Editar en docker-swarm.yml:

image: gonoalejo/microservicios_usuarios:v2


Redeploy:

docker stack deploy -c docker-swarm.yml proyecto_final

9. Pruebas Manuales
HAProxy Stats:
http://192.168.100.3:8404

Frontend:
http://192.168.100.3:8080

APIs enroutadas por HAProxy (puerto 5080):

Usuarios:

curl http://192.168.100.3:5080/api/usuarios/id


Compras:

curl http://192.168.100.3:5080/api/compras/id


Envíos:

curl http://192.168.100.3:5080/api/envios/id


Perfumes:

curl http://192.168.100.3:5080/api/perfumes/id


PQRS:

curl http://192.168.100.3:5080/api/pqrs/id

10. Debugging de haproxy, por si falla

Ver logs del servicio HAProxy:

docker service logs proyecto_final_haproxy --raw --tail 200


Listar contenedor real:

docker ps | grep haproxy


Entrar:

docker exec -it <ID> sh


Validar configuración:

haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg


14. Recuperación Rápida

Si una imagen se corrompe:

docker pull gonoalejo/haproxy:backup
docker tag gonoalejo/haproxy:backup gonoalejo/haproxy:superstable2
docker push gonoalejo/haproxy:superstable2
docker stack deploy -c docker-swarm.yml proyecto_final


En menos de 3 minutos el sistema vuelve a funcionar.

15. Pruebas de Carga y Escalabilidad con Apache JMeter

Para evaluar el rendimiento de los microservicios y validar el comportamiento del sistema en condiciones de alta demanda, se utilizaron pruebas de carga mediante Apache JMeter. Estas pruebas permiten identificar:

Capacidad máxima de peticiones por segundo

Latencias bajo estrés

Consumo de CPU y RAM por microservicio

Comportamiento del balanceo de carga en HAProxy

Estabilidad del sistema con escalado horizontal

15,1.Configuración de la prueba

Se definió un escenario de carga que simula el comportamiento real de usuarios concurrentes utilizando el endpoint de cada microservicio a través de HAProxy:

Ejemplo de endpoint usado en la prueba:

http://192.168.100.3:5080/api/usuarios/1

Parámetros utilizados:

100 usuarios concurrentes

Ramp-up de 5 segundos

2000 peticiones totales por prueba

Tiempo máximo de respuesta aceptable: 800 ms

15,2. Escalabilidad con Docker Swarm

Para validar la escalabilidad horizontal del sistema, se incrementó el número de réplicas de varios microservicios utilizando Docker Swarm:

docker service scale proyecto_final_microservicios_usuarios=3
docker service scale proyecto_final_microservicios_perfumes=3

Swarm distribuye automáticamente las réplicas en los nodos del clúster y HAProxy balancea la carga entre todas las instancias.

15,3. Resultados esperados

Al aplicar réplicas, se observó:

Disminución notable del tiempo promedio de respuesta.

Incremento del throughput (peticiones atendidas por segundo).

Reducción de errores por saturación.

Uso balanceado de CPU entre los nodos del clúster.

Este comportamiento confirma que el sistema soporta correctamente el escalado horizontal y aprovecha la arquitectura distribuida.

15,4. Validación del balanceo en HAProxy

Durante las pruebas, se monitoreó el dashboard de HAProxy en:

http://192.168.100.3:8404

Allí se puede observar en tiempo real:

Estado de cada instancia (UP/DOWN)

Número de peticiones por réplica

Distribución del tráfico entre réplicas

Latencia mínima, promedio y máxima

13.5. Conclusión de las pruebas de carga

El sistema demostró estabilidad, balanceo efectivo y la capacidad de manejar múltiples solicitudes concurrentes cuando se aumenta el número de réplicas de los microservicios críticos, validando así la robustez de la arquitectura implementada.
