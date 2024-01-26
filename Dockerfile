FROM node:latest AS nodejs
FROM ghcr.io/cirruslabs/android-sdk:33


# Prerequisites
RUN apt update && apt install -y curl git unzip xz-utils zip libglu1-mesa wget

# Set up new user
WORKDIR /home/src

# Download Flutter SDK
RUN mkdir /home/src/server
RUN mkdir /home/developer
RUN git clone https://github.com/flutter/flutter.git
ENV PATH "$PATH:/home/src/flutter/bin"
RUN flutter config --enable-android \
                   --no-enable-linux-desktop \
                   --no-enable-web \
                   --no-enable-ios \
 && (yes | flutter doctor --android-licenses)

#  RUN apt-get install -y git-core curl build-essential openssl libssl-dev \
#  && git clone https://github.com/nodejs/node.git \
#  && cd node \
#  && ./configure \
#  && make \
#  && sudo make install

COPY --from=nodejs /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=nodejs /usr/local/bin/node /usr/local/bin/node
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm


# Run basic check to download Dark SDK
RUN flutter doctor

COPY package.json /home/src/server
RUN cd /home/src/server && npm install
COPY . /home/src/server

RUN apt-get update && \
    apt-get install -y -q --allow-unauthenticated \
    git \
    sudo
RUN usermod -aG sudo root &&  \
    mkdir -p /home/linuxbrew/.linuxbrew && \
    chown -R root: /home/linuxbrew/.linuxbrew
USER root
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
USER root
RUN chown -R $CONTAINER_USER: /home/linuxbrew/.linuxbrew
ENV PATH="/home/linuxbrew/.linuxbrew/bin:${PATH}"
USER root
RUN brew update
RUN brew doctor
RUN git config --global --add safe.directory /home/src/flutter
RUN sudo chown -R $(whoami) /home/src/flutter/
RUN brew tap leoafarias/fvm
RUN brew install fvm

# CMD cd /home/src/server && node app.js
CMD [ "node", "server/backend.js" ]