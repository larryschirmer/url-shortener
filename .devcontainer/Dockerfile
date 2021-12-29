ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# Install kubectl
RUN apt-get update && apt-get -y install
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

# Install helm
RUN curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
RUN chmod 700 get_helm.sh
RUN ./get_helm.sh

# Install dns validation tools
RUN apt update
RUN apt install dnsutils -y

ENV KUBECONFIG=./kubeconfig.yaml
ENV MONGO_URI=mongodb://localhost:27017
ENV NODE_ENV=development 
