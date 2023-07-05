# Use the official Nginx base image
FROM nginx:latest

# Copy the generated nginx.conf file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]
