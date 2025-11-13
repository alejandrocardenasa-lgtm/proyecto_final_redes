# Imagen base de NGINX
FROM nginx:stable-alpine

# Eliminar configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos del frontend
COPY . /usr/share/nginx/html/

# Exponer puerto 80
EXPOSE 80

# Iniciar NGINX en primer plano
CMD ["nginx", "-g", "daemon off;"]
