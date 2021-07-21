const config = {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-1",
      BUCKET: "wit-cc-project-aws-hmc",
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://8ejj7wgfpi.execute-api.us-east-1.amazonaws.com/dev",
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_S5j6hEJyb",
      APP_CLIENT_ID: "201ffcajb9q8bpbn405r6kecbb",
      IDENTITY_POOL_ID: "us-east-1:c5975817-90ef-4b3a-b733-943dec68a9f0",
    },
  };
  
  export default config;