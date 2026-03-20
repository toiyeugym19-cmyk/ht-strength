---
name: Cloud (AWS)
description: AWS services and deployment patterns
---

# AWS Cloud

## EC2 Deployment

```bash
# Launch instance
aws ec2 run-instances \
  --image-id ami-xxx \
  --instance-type t2.micro \
  --key-name my-key

# Deploy app
ssh ec2-user@instance-ip
git clone repo
npm install
pm2 start app.js
```

## S3 Static Hosting

```bash
# Upload build
aws s3 sync ./dist s3://my-bucket --delete

# Configure website
aws s3 website s3://my-bucket \
  --index-document index.html \
  --error-document 404.html
```

## Lambda Functions

```typescript
export const handler = async (event) => {
  const body = JSON.parse(event.body);
  
  // Process data
  const result = await processData(body);
  
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
```

## RDS Database

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.RDS_HOST,
  database: 'gym',
  user: 'admin',
  password: process.env.RDS_PASSWORD
});

const result = await pool.query('SELECT * FROM members');
```

## CloudFormation

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: gym-assets
```
