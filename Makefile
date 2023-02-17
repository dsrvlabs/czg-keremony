build_image:
	docker build --platform amd64 -t czg-keremony .
	docker tag czg-keremony rootwarp/czg-keremony:latest
