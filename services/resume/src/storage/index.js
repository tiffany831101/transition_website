const AWS = require("aws-sdk");
const { CDN_ID } = require("../config");

class S3Service {
  constructor(accessKeyId, secretAccessKey, region) {
    this.s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });
  }

  async getUpdatedImageUrl({ bucketName, imageFile, userId, resumeId }) {
    const imageFileName = `images/${userId}/${resumeId}/image.jpg`;

    const imageUploadParams = {
      Bucket: bucketName,
      Key: imageFileName,
      Body: imageFile,
      ContentType: "image/jpeg",
      // ACL: "public-read",
    };

    try {
      const imageUploadResult = await this.s3
        .putObject(imageUploadParams)
        .promise();

      const imageUrl = `https://${CDN_ID}.cloudfront.net/${imageFileName}`;

      return imageUrl;
    } catch (err) {
      throw new Error(`Error uploading files to S3: ${err.message}`);
    }
  }

  async getInsertedImageUrl({ bucketName, imageFile, userId, resumeId }) {
    console.log("userId: ", userId);
    // return;
    const imageFileName = `images/${userId}/${resumeId}/image.jpg`;

    const imageUploadParams = {
      Bucket: bucketName,
      Key: imageFileName,
      Body: imageFile,
      ContentType: "image/jpeg",
      // ACL: "public-read",
    };

    try {
      const imageUploadResult = await this.s3
        .upload(imageUploadParams)
        .promise();

      console.log("image res: ", imageUploadResult);
      return imageUploadResult;
    } catch (err) {
      throw new Error(`Error uploading files to S3: ${err.message}`);
    }
  }

  async getInsertedHtmlUrl({ bucketName, htmlFile, userId, resumeId }) {
    console.log("userId: ", userId);
    // return;
    const htmlFileName = `htmls/${userId}/${resumeId}/resume.html`;

    const htmlUploadParams = {
      Bucket: bucketName,
      Key: htmlFileName,
      Body: htmlFile,
      ContentType: "text/html",
      // ACL: "public-read",
    };

    try {
      const htmlUploadResult = await this.s3.upload(htmlUploadParams).promise();

      console.log("image res: ", htmlUploadResult);
      return htmlUploadResult;
    } catch (err) {
      throw new Error(`Error uploading files to S3: ${err.message}`);
    }
  }

  async updateInsertedHtmlUrl({ bucketName, htmlFile, userId, resumeId }) {
    console.log("userId: ", userId);
    // return;
    const htmlFileName = `htmls/${userId}/${resumeId}/resume.html`;

    const htmlUploadParams = {
      Bucket: bucketName,
      Key: htmlFileName,
      Body: htmlFile,
      ContentType: "text/html",
      // ACL: "public-read",
    };

    try {
      const htmlUploadResult = await this.s3
        .putObject(htmlUploadParams)
        .promise();

      return htmlUploadResult;
    } catch (err) {
      throw new Error(`Error uploading files to S3: ${err.message}`);
    }
  }

  // async uploadImagesToS3(imageFile, userId, resumeId, bucketName) {
  //   const imageFileName = `${userId}/${resumeId}/image.jpg`;

  //   const imageUploadParams = {
  //     Bucket: bucketName,
  //     Key: imageFileName,
  //     Body: imageFile,
  //   };

  //   try {
  //     const imageUploadResult = await this.s3
  //       .upload(imageUploadParams)
  //       .promise();

  //     return {
  //       imageUrl: imageUploadResult.Location,
  //     };
  //   } catch (err) {
  //     throw new Error(`Error uploading files to S3: ${err.message}`);
  //   }
  // }

  // Add more methods for additional S3 operations as needed
}

module.exports = S3Service;
