# MedCare4Home

https://www.medcare4home.com/

## Introduction

Managing healthcare data is essential for everyone, but it can be challenging and time-consuming. MedCare4Home is an easy-to-use cloud solution to manage healthcare data. With our application, users can seamlessly locate their medical documents from different resources. We also provide them with the ability to self-report ongoing symptoms that might be necessary to track before the next doctor's appointment. In the future, we consider expanding our project to allow users to manage data for multiple family members within one account and set up personalized medication reminders. 

## Features
1. Registration
2. Login/Logout
3. Update/Reset password
4. Upload Medical Documents
5. Self-report sysmptoms

## System Architecture
![System Architecture](https://github.com/wangm1atwit/AWS-MedCare4Home/blob/main/image/System%20Architecture.png)

## Deployment
1. Install dependencies in the ```root``` directory and ```/API``` directory:
      ```
      $ npm install
      ```
2. Create an aws account and an IAM user. Write down the __user access key ID__ and __the secret access key__.
3. Install and configure AWS CLI  
      - Using pip on Linux, macOS, or Unix:
      ```
      $ sudo pip install awscli
      ```
      - or using Homebrew on macOS:
      ```
      $ brew install awscli
      ```
      - configure using your Secret Key ID and your Access Key:
      ```
      $ aws configure
      ```
4. Install serverless framework
      ```
      npm install serverless -g
      ```
5. Create two DynamoDB tables using the [AWS Console](https://aws.amazon.com/console/).
      - Create a table named ```documents``` with ```userId``` as the partition key and ```documentId``` as the sorted key. 
      - Similarly, create a ```symptoms``` table with have ```userId``` as the partition key and ```symptomId``` as the sorted key.

6. Create a S3 bucket using the [AWS Console](https://aws.amazon.com/console/). 
7. Deploy the APIs. Run the following in ```/API``` directory.
      ```
      $ serverless deploy
      ```

8. Create Cognito user pool
      - Create user pool
         - Select Manage your User Pools -> Select Create a User Pool -> Select Review defaults (for username attributes, make sure to select Email address or phone numbers and Allow email addresses)  
         - Take a note of the __Pool Id__ and __Pool ARN__ which will be required later. 
      - Create App Client
        - Select App Clients under General Settings on the left panel -> Select Add an app client -> Enter App client name, un-select Generate client secret, select Enable sign-in API for server-based authentication -> select Create app client.
        - Take note of the __App client id__ which will be required later.
      - Create Domain Name
        -  select Domain name from the left panel. Enter your unique domain name and select Save changes. 
9. Create Cognito Identity Pool
     - Select ManageFederated Identities -> Enter an Identity pool name, Select Authentication providers. Under Cognito tab, enter __User Pool ID__ and __App Client ID__ of the User Pool you just created -> Select Create Pool.
     - Select View Details -> Select View Policy Document in the top section -> Select Edit and Ok to edit -> Add the following policy into editor (make sure to replace the indicated values with your own) -> Select Allow -> Take a note of the __Identity pool ID__. 
         ```
                  {
            "Version": "2012-10-17",
            "Statement": [
              {
                "Effect": "Allow",
                "Action": [
                  "mobileanalytics:PutEvents",
                  "cognito-sync:*",
                  "cognito-identity:*"
                ],
                "Resource": [
                  "*"
                ]
              },
              {
                "Effect": "Allow",
                "Action": [
                  "s3:*"
                ],
                "Resource": [
                  "arn:aws:s3:::REPLACE_ME_YOUR_S3_UPLOADS_BUCKET_NAME/private/${cognito-identity.amazonaws.com:sub}/*"
                ]
              },
              {
                "Effect": "Allow",
                "Action": [
                  "execute-api:Invoke"
                ],
                "Resource": [
                  "arn:aws:execute-api:REPLACE_ME_YOUR_API_GATEWAY_REGION:*:REPLACE_ME_YOUR_API_GATEWAY_ID/*/*/*"
                ]
              }
            ]
          }
        ```
10. Configure AWS Amplify
      - Install AWS Amplify
      ```
      $ npm install aws-amplify --save
      ```   
      - Modify ```src/config.js```, replace all values with your own.
      - Host the application on Amplify by following [this documentation](https://aws.amazon.com/getting-started/hands-on/host-static-website/)

11. To run and test the code locally, run the following command in the root dirctory:
      ```
      $ npm start
      ```   


## Demo video

https://www.youtube.com/watch?v=TlzJQrBWnOM

## References

Tutorial: https://serverless-stack.com/#guide

## Team members

* Mengting Wang (wangm1@wit.edu): Team Lead, Backend dev
* Yen Le (ley@wit.edu): Frontend dev, UI design
