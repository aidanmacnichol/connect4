variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "ca-central-1"
}

variable "project_name" {
  type        = string
  description = "Name prefix for resources"
  default     = "connect4"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t4g.small"
}

variable "ssh_cidr" {
  type        = string
  description = "CIDR allowed to SSH (your public IP /32). Prefer tightening this."
  default     = "0.0.0.0/0"
}

variable "key_name" {
  type        = string
  description = "Existing EC2 key pair name for SSH"
}

variable "domain_name" {
  type        = string
  description = "Public hostname pointed at the Elastic IP (for docs / user-data hints)"
  default     = ""
}
