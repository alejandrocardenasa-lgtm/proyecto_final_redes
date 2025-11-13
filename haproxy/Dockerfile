cat << 'EOF' > ~/proyecto_final/haproxy/Dockerfile
FROM haproxy:2.8

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

EXPOSE 80 8404

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg", "-db"]
EOF
