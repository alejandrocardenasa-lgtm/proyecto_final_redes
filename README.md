# Proyecto Final 
Autores: Alejandro Cárdenas Anturi – Santiago Uribe Londoño  
Universidad Autónoma de Occidente – 2025




# 1. Clonar el repositorio

En el nodo 2 (manager):

git clone https://github.com/turepo/proyecto_final.git
cd proyecto_final

Haz lo mismo en los nodos 1 y 3 si necesitas los archivos localmente.

---

# 2. Instalar Docker y Docker Compose en los 3 nodos

```bash
sudo apt update
sudo apt install docker.io docker-compose-plugin -y
sudo usermod -aG docker vagrant
```

Cerrar y volver a entrar a la terminal.

# 3. Inicializar Docker Swarm (solo en nodo 2)

docker swarm init --advertise-addr 192.168.100.3

Copia el token que aparece.

---

# 4. Unir nodos al clúster (en nodo 1 y nodo 3)

docker swarm join --token <TOKEN> 192.168.100.3:2377


# 5. Crear la red overlay (solo una vez, en nodo 2)

docker network create --driver overlay proyecto_final_net

# 6. Desplegar todo el sistema (en nodo 2)

cd proyecto_final
docker stack deploy -c docker-swarm.yml proyecto_final

# 7. Verificar estado del despliegue

Ver servicios:

docker stack services proyecto_final

Ver réplicas:

docker service ps proyecto_final_microservicios_usuarios


# 8. Endpoints útiles

Frontend (Nginx):

http://192.168.100.3:8080

HAProxy Dashboard:

http://192.168.100.3:8404

APIs:

http://192.168.100.3:5080/api/usuarios
http://192.168.100.3:5080/api/perfumes
http://192.168.100.3:5080/api/compras
http://192.168.100.3:5080/api/envios
http://192.168.100.3:5080/api/pqrs


# 🔄 9. Actualizar un microservicio (Rolling Update)

En el microservicio que quieres actualizar:

docker build -t gonoalejo/microservicios_usuarios:v2 .
docker push gonoalejo/microservicios_usuarios:v2

Editar en `docker-swarm.yml`:

image: gonoalejo/microservicios_usuarios:v2

Redeploy:

docker stack deploy -c docker-swarm.yml proyecto_final

# 10. Borrar completamente el stack (si algo falla)

docker stack rm proyecto_final
docker network rm proyecto_final_net


