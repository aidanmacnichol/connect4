output "public_ip" {
  description = "Elastic IP — point your domain A record here"
  value       = aws_eip.app.public_ip
}

output "instance_id" {
  value = aws_instance.app.id
}

output "ssh_example" {
  value = "ssh -i ~/.ssh/<your-key>.pem ubuntu@${aws_eip.app.public_ip}"
}

output "next_steps" {
  value = compact([
    "1. Point DNS A record to ${aws_eip.app.public_ip}",
    "2. SSH in and clone/copy the repo to /opt/connect4",
    "3. Copy .env.prod.example → .env and fill secrets",
    var.domain_name != "" ? "4. Set SITE_ADDRESS=${var.domain_name} and FRONTEND_URL=https://${var.domain_name}" : "4. Set SITE_ADDRESS and FRONTEND_URL to your domain",
    "5. docker compose -f docker-compose.prod.yml up -d --build",
    "6. Add Google OAuth redirect URI for https://<domain>/api/auth/google/callback",
  ])
}
