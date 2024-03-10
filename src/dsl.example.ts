import type { App, ViewNavbar } from './types';

// Example

const navbar: ViewNavbar = {
  name: 'navbar',
  type: 'navbar',
  links: [
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
  favicon: 'https://emojicdn.elk.sh/🐦?style=google',
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
      returns: { msg: 'string' },
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
      params: {},
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
          type: 'submit'
        }
      ]
    },
    {
      name: 'upvotePost',
      action: 'upvotePost',
      params: { id: 'string' },
      fields: [
        {
          name: 'submit',
          label: 'Upvote',
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
        params: {
          username: '{{ getName.loading ? "loading..." : getName.data }}'
        },
        children: [navbar, 'Welcome, {{ username }}!']
      }
    },
    {
      name: 'posts',
      path: '/posts',
      view: {
        type: 'container',
        children: [
          navbar,
          'Posts',
          { type: 'form', form: 'createPost', params: {} },
          {
            name: 'postsList',
            type: 'list',
            itemRef: 'post',
            value: 'getPosts.loading ? [] : getPosts.data',
            container: {
              type: 'container',
              children: [
                '{{ post.author }}',
                '{{ post.content }}',
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
