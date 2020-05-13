const Course = require("../models/Course");
const Topic = require("../models/Topic");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Student = require("../models/Student");
const {
  UserInputError
} = require('apollo-server');
const {
  encrypt,
  compare
} = require("../utils/encryptor");

const resolvers = {
  User: {
    student: async (parent) => {
      const student = await Student.findOne({
        userID: parent.id
      });
      return student;
    },
    trainer: async (parent) => {
      const trainer = await Trainer.findOne({
        userID: parent.id
      });
      return trainer;
    },
  },

  Course: {
    topics: async (parent) => {
      const topics = await Topic.find({
        courseID: parent.id
      });
      return topics;
    },
    participated_students: async (parent) => {
      let students = [];
      let ans = [];
      students = await Student.find({})
      students.forEach(async student => {
        const {
          coursesIDs
        } = student
        if (coursesIDs.includes(parent.id)) {
          ans.push(student);
        }
      })
      return ans;
    },
  },

  Student: {
    user: async (parent) => {
      const user = await User.findById(parent.userID);
      return user;
    },
    courses: async (parent) => {
      const {
        coursesIDs
      } = parent
      let courses = [];
      let counter = 0;

      if (coursesIDs.length == 0) return []

      for (let index = 0; index < coursesIDs.length; index++) {
        const id = coursesIDs[index];
        const t = await Course.findById(id);
        courses.push(t)
        counter++;
        if (counter >= coursesIDs.length){
          return courses;
        }
      }

    },
  },

  Trainer: {
    user: async (parent) => {
      const user = await User.findById(parent.userID);
      return user;
    },
    topics: async (parent) => {
      const {
        topicsIDs
      } = parent
      let topics = [];
      let counter = 0;

      if (topicsIDs.length == 0) return []

      for (let index = 0; index < topicsIDs.length; index++) {
        const id = topicsIDs[index];
        const t = await Topic.findById(id);
        topics.push(t)
        counter++;
        if (counter >= topicsIDs.length){
          return topics;
        }
      }

    },
  },

  Topic: {
    course: async (parent) => {
      const course = await Course.findById(parent.courseID);
      return course;
    },
    assigned_trainers: async (parent) => {
      let trainers = [];
      let ans = [];
      trainers = await Trainer.find({})

      for (let index = 0; index < trainers.length; index++) {
        const trainer = trainers[index];
        const {
          topicsIDs
        } = trainer
        if (topicsIDs.includes(parent.id)) {
          ans.push(trainer);
        }
      }

      return ans;
    },
  },

  Query: {

    courses: async () => {
      try {
        const courses = await Course.find({});
        return courses;
      } catch (error) {
        return error;
      }
    },

    topics: async () => {
      try {
        const topics = await Topic.find({});
        return topics;
      } catch (error) {
        return error;
      }
    },

    users: async () => {
      try {
        const users = await User.find({});
        return users;
      } catch (error) {
        return error;
      }
    },

    trainers: async () => {
      try {
        const trainers = await Trainer.find({});
        return trainers;
      } catch (error) {
        return error;
      }
    },

    students: async () => {
      try {
        const students = await Student.find({});
        return students;
      } catch (error) {
        return error;
      }
    },

    getStudentByID: async (_, args) => {
      try {
        const {studentID} = args;
        const student = await Student.findById(studentID);
        return student;
      } catch (error) {
        return error;
      }
    },

    getTrainerByID: async (_, args) => {
      try {
        const {trainerID} = args;
        const trainer = await Trainer.findById(trainerID);
        return trainer;
      } catch (error) {
        return error;
      }
    },

    getCourseByID: async (_, args) => {
      try {
        const {courseID} = args;
        const course = await Course.findById(courseID);
        return course;
      } catch (error) {
        return error;
      }
    },

    getUserByID: async (_, args) => {
      try {
        const {userID} = args;
        const user = await User.findById(userID);
        return user;
      } catch (error) {
        return error;
      }
    },

    getTopicByID: async (_, args) => {
      try {
        const {topicID} = args;
        const topic = await Topic.findById(topicID);
        return topic;
      } catch (error) {
        return error;
      }
    },

  },

  Mutation: {

    changePassword: async (_, args) => {
      try {
        let {
          userID,
          oldPassword,
          newPassword
        } = args;
        let user = await User.findById(userID);

        if (!user || !compare(oldPassword, user.password)){
          throw new UserInputError("Invalid user or password");
        }

        newPassword = encrypt(newPassword);

        user = await User.findByIdAndUpdate(userID, {password: newPassword})
        user = await User.findById(userID);

        return user;
      } catch (error) {
        return error;
      }
    },

    assignStudentToCourse: async (_, args) => {
      try {
        const {
          studentID,
          courseID
        } = args;
        let student = await Student.findById(studentID);
        let participatedCourses = student.coursesIDs;
        participatedCourses.push(courseID);
        student = await Student.findByIdAndUpdate(studentID, {coursesIDs: participatedCourses})
        student = await Student.findById(studentID);
        return student;
      } catch (error) {
        return error;
      }
    },

    assignTrainerToTopic: async (_, args) => {
      try {
        const {
          trainerID,
          topicID
        } = args;
        let trainer = await Trainer.findById(trainerID);
        let participatedTopic = trainer.topicsIDs;
        participatedTopic.push(topicID);
        trainer = await Trainer.findByIdAndUpdate(trainerID, {topicsIDs: participatedTopic})
        trainer = await Trainer.findById(trainerID);
        return trainer;
      } catch (error) {
        return error;
      }
    },

    addCourse: async (_, args) => {
      try {
        const {
          name
        } = args;
        const course = await new Course({
          name
        }).save();
        return course;
      } catch (error) {
        return error;
      }
    },

    addTopic: async (_, args) => {
      try {
        const {
          title,
          courseID
        } = args;
        const topic = await new Topic({
          title,
          courseID
        }).save();
        return topic;
      } catch (error) {
        return error;
      }
    },

    signup: async (_, args) => {
      try {
        let {
          username,
          email,
          password
        } = args;

        const existedUser = await User.findOne({
          email
        });

        if (existedUser) {
          throw new UserInputError("Please enter a valid email")
        }

        password = encrypt(password);

        const user = await new User({
          username,
          email,
          password
        }).save();
        return user;
      } catch (error) {
        return error;
      }
    },

    login: async (_, args) => {
      try {
        let {
          email,
          password
        } = args;

        const existedUser = await User.findOne({
          email
        });

        if (!existedUser || !compare(password, existedUser.password)) {
          throw new UserInputError("Invalid email or password")
        }

        const user = existedUser
        return user;
      } catch (error) {
        return error;
      }
    },

    addStudent: async (_, args) => {
      try {
        let {
          name,
          dob,
          address,
          phone_number,
          email,
          password,
          coursesIDs
        } = args;

        const existedUser = await User.findOne({
          email
        });

        if (existedUser) {
          throw new UserInputError("Please enter a valid email")
        }

        password = encrypt(password);

        const user = await new User({
          username: name,
          email,
          password,
          role: "Student"
        }).save()
        const student = await new Student({
          name,
          dob,
          address,
          phone_number,
          userID: user._id,
          coursesIDs
        }).save()

        return student
      } catch (error) {
        return error;
      }
    },

    addStudent: async (_, args) => {
      try {
        let {
          name,
          dob,
          address,
          phone_number,
          email,
          password,
          coursesIDs
        } = args;

        const existedUser = await User.findOne({
          email
        });

        if (existedUser) {
          throw new UserInputError("Please enter a valid email")
        }

        password = encrypt(password);

        const user = await new User({
          username: name,
          email,
          password,
          role: "Student"
        }).save()
        const student = await new Student({
          name,
          dob,
          address,
          phone_number,
          userID: user._id,
          coursesIDs
        }).save()

        return student
      } catch (error) {
        return error;
      }
    },

    addTrainer: async (_, args) => {
      try {
        let {
          name,
          dob,
          address,
          phone_number,
          profession,
          email,
          password,
          topicsIDs
        } = args;

        const existedUser = await User.findOne({
          email
        });

        if (existedUser) {
          throw new UserInputError("Please enter a valid email")
        }

        password = encrypt(password);

        const user = await new User({
          username: name,
          email,
          password,
          role: "Trainer"
        }).save()
        const trainer = await new Trainer({
          name,
          dob,
          address,
          phone_number,
          userID: user._id,
          topicsIDs,
          profession
        }).save()

        return trainer
      } catch (error) {
        return error;
      }
    },

    updateCourse: async (_, args) => {
      try {
        const {
          courseID,
          name
        } = args;
        let course = await Course.findByIdAndUpdate(courseID, {
          name
        })
        course = await Course.findById(courseID);
        return course;
      } catch (error) {
        return error;
      }
    },

    updateTopic: async (_, args) => {
      try {
        const {
          topicID,
          courseID,
          title
        } = args;
        let topic = await Topic.findByIdAndUpdate(topicID, {
          courseID,
          title
        })
        topic = await Topic.findById(topicID);
        return topic;
      } catch (error) {
        return error;
      }
    },

    updateStudent: async (_, args) => {
      try {
        const {
          studentID,
          name,
          dob,
          address,
          phone_number,
          coursesIDs
        } = args;
        let student = await Student.findByIdAndUpdate(studentID, {
          name,
          dob,
          address,
          phone_number,
          coursesIDs
        })
        student = await Student.findById(studentID);
        return student;
      } catch (error) {
        return error;
      }
    },

    updateTrainer: async (_, args) => {
      try {
        const {
          trainerID,
          name,
          dob,
          address,
          phone_number,
          topicsIDs,
          profession
        } = args;
        let trainer = await Trainer.findByIdAndUpdate(trainerID, {
          name,
          dob,
          address,
          phone_number,
          topicsIDs,
          profession
        })
        trainer = await Trainer.findById(trainerID);
        return trainer;
      } catch (error) {
        return error;
      }
    },

    deleteCourse: async (_, args) => {
      try {
        const {
          courseID
        } = args;
        let course = await Course.findByIdAndDelete(courseID)
        const topics = await Topic.find({
          courseID
        })
        const students = await Student.find()
        const trainers = await Trainer.find()

        for (let index = 0; index < topics.length; index++) {
          const topic = topics[index];
          for (let j = 0; j < trainers.length; j++) {
            const trainer = trainers[j];
            const {topicsIDs} = trainer;

            if (topicsIDs.includes(topic._id)){
              await Trainer.findByIdAndUpdate(trainer._id, {
                topicsIDs: topicsIDs.filter(topicID => {
                  return topicID != topic._id
                })
              })
            }
          }
        }

        for (let index = 0; index < students.length; index++) {
          const student = students[index];
          if (student.coursesIDs.includes(courseID)) {
            await Student.findByIdAndUpdate(student._id, {
              coursesIDs: student.coursesIDs.filter(coursesID => {
                return coursesID != courseID
              })
            })
          }
        }

        for (let index = 0; index < topics.length; index++) {
          const topic = topics[index];
          await Topic.findByIdAndDelete(topic._id);
        }

        return course;
      } catch (error) {
        return error;
      }
    },

    deleteTopic: async (_, args) => {
      try {
        const {
          topicID
        } = args;
        let topic = await Topic.findByIdAndDelete(topicID)
        const trainers = await Trainer.find()

        for (let index = 0; index < trainers.length; index++) {
          const trainer = trainers[index];
          if (trainer.topicsIDs.includes(topicID)) {
            await Trainer.findByIdAndUpdate(trainer._id, {
              topicsIDs: trainer.topicsIDs.filter(topicsID => {
                return topicsID != topicID
              })
            })
          }
        }

        return topic;
      } catch (error) {
        return error;
      }
    },

    deleteStudent: async (_, args) => {
      try {
        const {
          studentID
        } = args;
        let student = await Student.findByIdAndDelete(studentID)
        let user = await User.findByIdAndDelete(student.userID)
        return student;
      } catch (error) {
        return error;
      }
    },

    deleteTrainer: async (_, args) => {
      try {
        const {
          trainerID
        } = args;
        let trainer = await Trainer.findByIdAndDelete(trainerID)
        let user = await User.findByIdAndDelete(trainer.userID)
        return trainer;
      } catch (error) {
        return error;
      }
    },

  }
};

module.exports = resolvers;