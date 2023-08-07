import { gql } from "@apollo/client";

// export const GET_POST = gql`
//   query GetPost($postId: ID!) {
//     getPost(postId: $postId) {
//       _id
//       preview
//       media
//       title
//       body
//       createdAt
//       likes {
//         _id
//         userId
//         postId
//         username
//         pfp
//         firstName
//         lastName
//         preview
//       }
//       comments {
//         _id
//         body
//         username
//         createdAt
//       }
//       hashtags {
//         hashtagText
//         category
//       }
//     }
//   }
// `;

export const GET_POST = gql`
query GetPost($postId: ID!) {
  getPost(postId: $postId) {
    _id
      preview
      media
      title
      body
      createdAt
    comments {
      _id
      body
      username
      createdAt
    }
    user {
      _id
      pfp
      firstName
      lastName
      username
      email
    }
    likes {
      _id
      user {
        _id
        pfp
        firstName
        lastName
        username
      }
      post {
        _id
        preview
      }

    }
    hashtags {
      hashtagText
      category
    }
  }
}
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      username
      firstName
      lastName
      pfp
      posts {
        _id
        title
        preview
        body
        hashtags {
          hashtagText
          category
        }
        likes {
          _id
          userId
          postId
          username
          pfp
          firstName
          lastName
          preview
        }
        comments {
          _id
          body
          username
          createdAt
        }
        createdAt
      }
      followers {
        _id
      }
      following {
        _id
      }
    }
  }
`;

export const GET_LOGGED_IN_USER = gql`
  query GetLoggedInUser {
    getLoggedInUser {
      _id
      username
      firstName
      lastName
      bio
      pfp
      email
      posts {
        _id
        title
        preview
      }
      followers {
        _id
      }
      following {
        _id
      }
    }
  }
`;

// export const GET_USER_BY_ID = gql`
//   query GetUserById($id: ID!) {
//     getUserById(input: $id) {
//       _id
//       username
//       firstName
//       lastName
//       bio
//       pfp
//       email
//       posts {
//         _id
//         title
//         preview
//       }
//       likes {
//         _id
//         userId
//         postId
//         username
//         pfp
//         firstName
//         lastName
//         preview
//       }
//       followers {
//         _id
//       }
//       following {
//         _id
//       }
//     }
//   }
// `;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      _id
      username
      firstName
      lastName
      bio
      pfp
      email
      posts {
        _id
        title
        body
        preview
        user {
          _id
          username
          email
        }
      }
      likes {
        _id
      }
      followers {
        _id
      }
      following {
        _id
      }
    }
  }
`;
