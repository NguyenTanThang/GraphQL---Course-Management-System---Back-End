const { gql } = require('apollo-server');

const typeDefs = gql`
  type Course {
    id: ID!
    name: String
    created_date: String
    topics: [Topic]
    participated_students: [Student]
  }

  type Topic {
    id: ID!
    title: String
    created_date: String
    courseID: ID
    course: Course
    assigned_trainers: [Trainer]
  }

  type User {
    id: ID!
    username: String
    email: String!
    password: String
    role: String
    created_date: String
    student: Student
    trainer: Trainer
  }

  type Student {
    id: ID!
    name: String
    dob: String
    phone_number: String
    address: String
    created_date: String
    userID: ID!
    user: User
    coursesIDs: [String]
    courses: [Course]
  }

  type Trainer {
    id: ID!
    name: String
    dob: String
    phone_number: String
    address: String
    profession: String
    created_date: String
    userID: ID!
    user: User
    topicsIDs: [String]
    topics: [Topic]
  }

  type Query {
    courses: [Course]
    topics: [Topic]
    users: [User]
    students: [Student]
    trainers: [Trainer]
    getStudentByID(studentID: ID!): Student
    getTrainerByID(trainerID: ID!): Trainer
    getCourseByID(courseID: ID!): Course
    getTopicByID(topicID: ID!): Topic
    getUserByID(userID: ID!): User
  }

  type Mutation {
    addCourse(name: String!): Course
    addTopic(title: String!, courseID: ID!): Topic
    signup(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    addStudent(name: String!, dob: String!, phone_number: String!, address: String!, coursesIDs: [String], email: String!, password: String!): Student
    addTrainer(name: String!, dob: String!, phone_number: String!, address: String!, topicsIDs: [String], email: String!, password: String!, profession: String!): Trainer

    updateCourse(courseID: ID!, name: String): Course
    updateTopic(topicID: ID!, title: String, courseID: ID): Topic
    updateStudent(studentID: ID!, name: String, dob: String, phone_number: String, address: String, coursesIDs: [String]): Student
    updateTrainer(trainerID: ID!, name: String, dob: String, phone_number: String, address: String, topicsIDs: [String], profession: String): Trainer
    changePassword(userID: ID!, oldPassword: String!, newPassword: String!): User

    deleteCourse(courseID: ID!): Course
    deleteTopic(topicID: ID!): Topic
    deleteStudent(studentID: ID!): Student
    deleteTrainer(trainerID: ID!): Trainer

    assignStudentToCourse(courseID: ID!, studentID: ID!): Student
    assignTrainerToTopic(topicID: ID!, trainerID: ID!): Trainer
  }
`;

module.exports = typeDefs;