FROM python:3.8

# Install curl for healthcheck
COPY --from=tarampampam/curl:7.78.0 /bin/curl /bin/curl

WORKDIR /wheels

# Create wheels directory to install the wheel of tensorflow without AVX instructions
ARG FILEID=1PShu5QJCWTnkCansDPeMT6ZwIDUuwgps
ARG FILENAME=tensorflow-2.12.0-cp38-cp38-linux_x86_64.whl

# See https://stackoverflow.com/questions/37453841
RUN wget --load-cookies /tmp/cookies.txt \
  "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt \
    --keep-session-cookies --no-check-certificate "https://docs.google.com/uc?export=download&id=$FILEID" -O- \
    | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=$FILEID" -O $FILENAME \
  && rm -rf /tmp/cookies.txt

WORKDIR /app

ENV VIRTUAL_ENV=nsfwpy
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="/app/$VIRTUAL_ENV/bin:$PATH"

# Install Tensorflow wheel and other dependencies
RUN pip install /wheels/tensorflow-2.12.0-cp38-cp38-linux_x86_64.whl
RUN pip install flask flask-restful nsfw-detector

RUN mkdir $VIRTUAL_ENV/src
COPY src/ $VIRTUAL_ENV/src/
COPY include/ $VIRTUAL_ENV/include/

WORKDIR /app/$VIRTUAL_ENV
COPY run.bash .

ENV PORT=4042
ENV HOST_ADDR=0.0.0.0
ENV MODEL_PATH=/app/$VIRTUAL_ENV/include/model/nsfw.299x299.h5

EXPOSE $PORT

CMD [ "./run.bash" ]
