# Usar uma imagem base do Node.js
FROM node:16

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

# Expor a porta que o React usa
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]