# Deploy Connect4 on AWS (cheap VM)

Goal: one EC2 box, Docker Compose (Caddy + API + Postgres), tear down with Terraform when idle.

## 0. One-time laptop setup

1. **AWS account** with billing alerts.
2. Re-auth CLI (yours is expired):
   ```bash
   aws login
   # or: aws configure / aws sso login
   aws sts get-caller-identity
   ```
3. Install Terraform: https://developer.hashicorp.com/terraform/install  
   (`brew install terraform` on macOS)
4. Create an SSH key pair in the region you’ll use (`ca-central-1` by default):
   ```bash
   aws ec2 create-key-pair \
     --region ca-central-1 \
     --key-name connect4 \
     --query 'KeyMaterial' \
     --output text > ~/.ssh/connect4.pem
   chmod 400 ~/.ssh/connect4.pem
   ```

## 1. Prove the stack locally (recommended)

```bash
cp .env.prod.example .env
# For local HTTP smoke test:
# SITE_ADDRESS=:80
# FRONTEND_URL=http://localhost
# OAUTH_REDIRECT_URL=http://localhost/api/auth/google/callback
# CORS_ORIGINS=http://localhost
# COOKIE_SECURE=false
# + your Google OAuth client values (add http://localhost redirect in Google Console)

docker compose -f docker-compose.prod.yml up --build
```

Open http://localhost — API is under `/api`.

## 2. Provision the VM

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# edit key_name, ssh_cidr (your public IP/32), domain_name

terraform init
terraform apply
```

Note the `public_ip` output. Point your domain’s **A record** at that IP.

## 3. Deploy the app on the instance

```bash
ssh -i ~/.ssh/connect4.pem ubuntu@<public_ip>

# on the box:
sudo git clone <your-repo-url> /opt/connect4   # or scp/rsync
cd /opt/connect4
sudo cp .env.prod.example .env
sudo nano .env   # real secrets + SITE_ADDRESS=your.domain

sudo docker compose -f docker-compose.prod.yml up -d --build
curl -sS https://your.domain/api/health
```

## 4. Google OAuth

In Google Cloud Console → OAuth client:

- Authorized JavaScript origin: `https://your.domain`
- Authorized redirect URI: `https://your.domain/api/auth/google/callback`

## 5. Tear down (stop paying)

```bash
cd infra
terraform destroy
```

This deletes the instance, disk, and Elastic IP. **Postgres data is wiped.**  
Keep the AWS account / Terraform files; recreating is `terraform apply` again.

## Cost notes

- Running: roughly one `t4g.small` + 30GB gp3 + EIP  
- Destroyed: ~$0  
- Avoid adding ALB / RDS / NAT if you want easy cheap teardown
