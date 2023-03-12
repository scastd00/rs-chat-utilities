FROM python:3.8

WORKDIR /app
COPY nsfwpy /app/nsfwpy
COPY exec.bash .

# Install dependencies inside /app/nsfwpy with pipenv update
RUN pip install pipenv && \
	cd nsfwpy && \
	pipenv install

COPY --from=tarampampam/curl:7.78.0 /bin/curl /bin/curl

EXPOSE 4042
CMD [ "./exec.bash" ]
