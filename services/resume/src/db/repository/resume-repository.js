const e = require("express");
const { executeQuery, usersTable } = require("../connection");
const { v4: uuidv4 } = require("uuid");
/**
 * Interact with the database, should return queried data
 *
 */
class ResumeRepository {
  // async findUsersByEmail({ email }) {
  //   const data = await executeQuery("SELECT * FROM ?? WHERE email = ?", [
  //     usersTable,
  //     email,
  //   ]);

  //   return data;
  // }

  async putResumeData(data) {
    try {
      await executeQuery("PUT", {
        Item: data,
      });
      return true;
    } catch (err) {
      throw err;
    }
  }

  async updateResumeData(data) {
    const updateExpression =
      "SET #experience = :experienceValue, #job_title = :jobTitleValue, #created_at = :createdAtValue, #certificate = :certificateValue, #Facebook = :facebookValue, #LinkedIn = :linkedinValue, #country = :countryValue, #Gmail = :gmailValue, #GitHub = :githubValue, #city = :cityValue, #imageUrl = :imageUrlValue, #education = :educationValue, #last_name = :lastNameValue, #first_name = :firstNameValue, #self_intro_short = :selfIntroValue"; // Add all the attributes you want to update
    const expressionAttributeNames = {
      "#experience": "experience",
      "#job_title": "job_title",
      "#created_at": "created_at",
      "#certificate": "certificate",
      "#Facebook": "Facebook",
      "#LinkedIn": "LinkedIn",
      "#country": "country",
      "#Gmail": "Gmail",
      "#GitHub": "GitHub",
      "#city": "city",
      "#imageUrl": "imageUrl",
      "#education": "education",
      "#last_name": "last_name",
      "#first_name": "first_name",
      "#self_intro_short": "self_intro_short",
      // Add all the attribute names here
    };

    const expressionAttributeValues = {
      ":experienceValue": data.experience,
      ":jobTitleValue": data.job_title,
      ":createdAtValue": Date.now(), // Replace with the new created_at value
      ":certificateValue": data.certificate,
      ":facebookValue": data.Facebook,
      ":linkedinValue": data.LinkedIn,
      ":countryValue": data.country,
      ":gmailValue": data.Gmail,
      ":githubValue": data.GitHub,
      ":cityValue": data.city,
      ":imageUrlValue": data.imageUrl,
      ":educationValue": data.education,
      ":lastNameValue": data.last_name, // Replace with the new last_name value
      ":firstNameValue": data.first_name, // Replace with the new first_name value
      ":selfIntroValue": data.self_intro_short,
    };

    // console.log(data.resume_id);
    // console.log(data.imageUrl);
    const params = {
      Key: {
        resume_id: data.resume_id,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };
    const result = await executeQuery("UPDATE", params);

    return result.Attributes;
  }
  /**
   *
   * @param { string } email
   * @returns { object } the find the users email if exists
   */
  async findUsersByEmail({ email }) {
    const data = await executeQuery("GET", {
      IndexName: "email-index", // Specify the GSI name
      KeyConditionExpression: "#email = :emailValue", // Use #email as the placeholder for reserved keyword 'email'
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":emailValue": email,
      },
    });

    return data.Items;
  }

  async putHtmlUrlInDB(resumeId, htmlUrl) {
    const params = {
      Key: {
        resume_id: resumeId,
      },
      UpdateExpression: "SET #html = :url",
      ExpressionAttributeNames: {
        "#html": "html",
      },
      ExpressionAttributeValues: {
        ":url": htmlUrl,
      },
      ReturnValues: "ALL_NEW",
    };
    const data = await executeQuery("UPDATE", params);
    console.log("data: ", data);
    return data.Attributes;
  }

  async getResumeByUserId(userId) {
    const params = {
      IndexName: "userId-index", // Specify the GSI name
      KeyConditionExpression: "#userId = :userIdValue", // Use #email as the placeholder for reserved keyword 'email'
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userIdValue": userId,
      },
    };

    const data = await executeQuery("GET", params);
    return data.Items;
  }
  // async createUser({ nickname, email, password, salt }) {
  //   const data = await executeQuery(
  //     "INSERT INTO ?? (nickname, email, password, salt) VALUES (?, ?, ?, ?)",
  //     [usersTable, nickname, email, password, salt]
  //   );

  //   return data;
  // }

  async createUser({ nickname, email, password, salt }) {
    const uuid = uuidv4();
    const result = await executeQuery("PUT", {
      Item: {
        id: uuid,
        email,
        nickname,
        password,
        salt,
      },
      ConditionExpression: "attribute_not_exists(email)", // Move ConditionExpression outside of Item
    });

    const getUserInfo = await this.getUserById({ id: uuid });

    const { Count, Items } = getUserInfo;
    if (Count == 1) {
      return Items[0];
    } else {
      return [];
    }
  }
  async getUserById({ id }) {
    try {
      const result = await executeQuery("GET", {
        KeyConditionExpression: "#id = :idValue", // Use #email as the placeholder for reserved keyword 'email'
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":idValue": id,
        },
      });
      return result;
    } catch (err) {
      console.log("error: ", err);
    }
  }
}

module.exports = ResumeRepository;
