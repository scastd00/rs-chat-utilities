FROM python:3.8

# Install curl for healthcheck
COPY --from=tarampampam/curl:7.78.0 /bin/curl /bin/curl

WORKDIR /

# Create wheels directory to install the wheel of tensorflow without AVX instructions
RUN mkdir /wheels
COPY ./wheels ./wheels

WORKDIR /app

COPY ../run_nsfwpy.bash .

ENV VIRTUAL_ENV=nsfwpy
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="/app/$VIRTUAL_ENV/bin:$PATH"

# Install Tensorflow wheel and other dependencies
RUN pip install /wheels/tensorflow-2.12.0-cp38-cp38-linux_x86_64.whl
RUN pip install flask flask-restful nsfw-detector jinja2

RUN mkdir $VIRTUAL_ENV/src
COPY src/ $VIRTUAL_ENV/src/

ENV PORT=4042
ENV HOST_ADDR=0.0.0.0

EXPOSE $PORT
CMD [ "./run_nsfwpy.bash" ]
