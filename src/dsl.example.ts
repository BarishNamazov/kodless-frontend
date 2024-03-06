import type { App, View } from './types';

// Example

const navbar: View = {
  name: 'navbar',
  type: 'container',
  children: [
    {
      type: 'link',
      text: 'Home',
      href: '/'
    },
    {
      type: 'link',
      text: 'Posts',
      href: '/posts'
    }
  ]
};

const app: App = {
  name: 'Mini Social Media',
  actions: [
    {
      name: 'getName',
      method: 'GET',
      path: 'http://localhost:5000/api/random-name',
      params: {},
      returns: 'string'
    },
    {
      name: 'getPosts',
      method: 'GET',
      path: 'http://localhost:5000/api/posts',
      params: {},
      returns: 'array'
    },
    {
      name: 'getUpvotes',
      method: 'GET',
      path: 'http://localhost:5000/api/posts/:id/upvotes',
      params: { id: 'string' },
      returns: 'number'
    },
    {
      name: 'createPost',
      method: 'POST',
      path: 'http://localhost:5000/api/posts',
      params: { author: 'string', content: 'string' },
      returns: { author: 'string', content: 'string' },
      refreshes: ['getPosts']
    },
    {
      name: 'upvotePost',
      method: 'POST',
      path: 'http://localhost:5000/api/posts/:id/upvote',
      params: { id: 'string' },
      returns: {},
      refreshes: ['getUpvotes']
    }
  ],
  forms: [
    {
      name: 'createPost',
      title: 'Create a Post',
      action: 'createPost',
      params: [],
      fields: [
        {
          name: 'author',
          label: 'Author',
          required: true,
          placeholder: 'Your name',
          type: 'text'
        },
        {
          name: 'content',
          label: "What's on your mind?",
          required: true,
          placeholder: 'Type here...',
          type: 'textarea'
        },
        {
          name: 'submit',
          label: 'Post!',
          required: true,
          type: 'submit'
        }
      ]
    },
    {
      name: 'upvotePost',
      title: 'Upvote Post',
      action: 'upvotePost',
      params: [],
      fields: [
        {
          name: 'submit',
          label: 'Upvote',
          required: true,
          type: 'submit'
        }
      ]
    }
  ],
  pages: [
    {
      name: 'home',
      path: '/',
      view: {
        type: 'container',
        children: [navbar, { type: 'text', text: 'Welcome, {{ getName.loading ? "loading..." : getName.data }}!' }]
      }
    },
    {
      name: 'posts',
      path: '/posts',
      view: {
        type: 'container',
        children: [
          navbar,
          { type: 'text', text: 'Posts' },
          { type: 'form', form: 'createPost', params: {} },
          {
            name: 'postsList',
            type: 'list',
            itemRef: 'post',
            value: 'getPosts.loading ? [] : getPosts.data',
            container: {
              type: 'container',
              children: [
                { type: 'text', text: '{{ post.author }}' },
                { type: 'text', text: '{{ post.content }}' },
                {
                  type: 'text',
                  text: 'Upvotes: {{ getUpvotes.loading ? "loading..." : getUpvotes.data }}',
                  params: { id: 'post._id' }
                },
                { type: 'form', form: 'upvotePost', params: { id: 'post._id' } }
              ]
            }
          }
        ]
      }
    }
  ]
};

export default app;
