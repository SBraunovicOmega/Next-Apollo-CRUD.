import { gql, ApolloServer } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";


// omogucava da mozemo da komuniciramo sa datebase-om
// inicijalizacija 
const prisma = new PrismaClient();


// GraphQL schema, ovjde deklarisemo entite sa kojima cemo da radimo
// Query je sa fetchovanje podataka, a mutacija je za mjenjanje podataka

const typeDefs = gql`
  type BlogPost {
    id: String
    text: String
  }
  


  type Query {
    blogPosts: [BlogPost]
  
  }

  type Mutation {
    addBlogPost(text: String): BlogPost
    editBlogPost(id: String, text: String): BlogPost
    deleteBlogPost(id: String): BlogPost
  }
`;

const resolvers = {
  Query: {
    // po default-u graphQL proslijedjuje tri parametra
    blogPosts: (_parent, _args, _context) => {
      return prisma.blogPost.findMany();
    },
  },

  Mutation: {
    addBlogPost: (_parent, { text }, _context) => {
      return prisma.blogPost.create({ data: { text } });
    },
    editBlogPost: (_parent, { id, text }, _context) => {
      return prisma.blogPost.update({ where: { id }, data: { text } });
    },
    deleteBlogPost: (_parent, { id }, _context) => {
      return prisma.blogPost.delete({ where: { id } });
    },
  },
};

// Inicijalizacija Apollo servera

const apolloServer = new ApolloServer({ typeDefs, resolvers });

// Ce nam omoguciti da GraphQL server moze hendlati server

const handler = apolloServer.createHandler({ path: "/api/graphql" });

export const config = { api: { bodyParser: false } };

export default handler;
