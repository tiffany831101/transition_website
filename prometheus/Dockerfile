# Use the official Prometheus base image
FROM prom/prometheus:v2.30.3

# Copy your custom prometheus.yaml to the container's configuration directory
COPY prometheus.yaml /etc/prometheus/prometheus.yml

# Expose Prometheus' default port
EXPOSE 9090

# Start Prometheus with the custom configuration
CMD ["--config.file=/etc/prometheus/prometheus.yml"]
