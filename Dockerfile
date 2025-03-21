# Usar uma imagem base do Node.js
FROM node:16 AS builder

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Buildar a aplicação React
RUN npm run build

# Usar uma imagem leve para servir os arquivos estáticos
FROM nginx:alpine

# Copiar os arquivos buildados para o servidor Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor a porta dinâmica
EXPOSE $PORT

# Comando para rodar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]