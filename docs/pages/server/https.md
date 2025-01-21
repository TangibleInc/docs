# Let's Encrypt

[Let's Encrypt](https://letsencrypt.org/) is a nonprofit certificate authority providing TLS (Transport Layer Security) certificates for web domains. It enables HTTPS (Hypertext Transfer Protocol Secure) for encrypted communication between server and clients.


## List certificates

```sh
sudo certbot certificates
```

## Create certificate

There's an [API rate limit](https://letsencrypt.org/docs/rate-limits/) on how many certificate requests can be made, something like 10 certificates from a single IP address every 3 hours. For this reason, it's recommended to do a "dry run" to test if the command would be successful, then make the actual request.

### Dry run

```sh
sudo certbot certonly --test-cert --dry-run -d example.com -d www.example.com --webroot -w /home/ubuntu/apps/example.com
```

- `--test-cert` - Make request to test server
- `--dry-run` - Do a dry run without generating an actual certificate
- `-d example.com` - Specify domain
- `-d www.example.com` - Optionally `www` subdomain
- `--webroot -w /home/ubuntu/apps/example.com` - Path to site folder

  A temporary file is created in a folder `.well-known` for Let's Encrypt API to verify the domain ownership.

### Actual

Same as above, but without `--test-cert --dry-run`.

```sh
sudo certbot certonly -d example.com -d www.example.com --webroot -w /home/ubuntu/apps/example.com
```

## Delete certificate

```sh
sudo certbot delete --cert-name example.com
```
