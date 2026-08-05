terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional later: move state to S3 so destroy/apply works from any machine.
  # backend "s3" {
  #   bucket = "your-tf-state-bucket"
  #   key    = "connect4/terraform.tfstate"
  #   region = "ca-central-1"
  # }
}
