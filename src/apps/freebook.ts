import type { App, ViewNavbar } from '../types';

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
      showIf: 'user',
      text: 'Posts',
      href: '/posts'
    }
  ]
};

const app: App = {
  name: 'Freebook',
  favicon: 'https://emojicdn.elk.sh/📚?style=google',
  actions: [
    {
      name: 'login',
      method: 'POST',
      path: 'http://localhost:5000/api/login',
      params: { username: 'string' },
      returns: { msg: 'string' },
      refreshes: ['getName']
    },
    {
      name: 'logout',
      method: 'POST',
      path: 'http://localhost:5000/api/logout',
      params: {},
      returns: { msg: 'string' },
      refreshes: ['getName']
    },
    {
      name: 'getName',
      method: 'GET',
      path: 'http://localhost:5000/api/session',
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
      returns: 'array'
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
    },
    {
      name: 'removeUpvote',
      method: 'DELETE',
      path: 'http://localhost:5000/api/posts/:id/upvote',
      params: { id: 'string' },
      returns: {},
      refreshes: ['getUpvotes']
    },
    {
      name: 'getQuote',
      method: 'GET',
      path: 'https://api.quotable.io/random',
      params: {},
      returns: { content: 'string', author: 'string' },
      includeCredentials: false
    }
  ],
  forms: [
    {
      name: 'login',
      title: 'Choose your name',
      action: 'login',
      fields: [
        {
          name: 'username',
          label: 'Username',
          required: true,
          placeholder: 'Your username',
          type: 'text'
        },
        {
          name: 'submit',
          label: 'Log in',
          type: 'submit'
        }
      ]
    },
    {
      name: 'logout',
      title: 'Log out',
      action: 'logout',
      fields: [
        {
          name: 'submit',
          label: 'Log out',
          type: 'submit'
        }
      ]
    },
    {
      name: 'createPost',
      title: 'Create a Post',
      action: 'createPost',
      params: { author: 'string' },
      fields: [
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
    },
    {
      name: 'removeUpvote',
      action: 'removeUpvote',
      params: { id: 'string' },
      fields: [
        {
          name: 'submit',
          label: 'Remove Upvote',
          type: 'submit'
        }
      ]
    }
  ],
  params: {
    user: 'getName.error ? null : getName.data'
  },
  pages: [
    {
      name: 'home',
      path: '/',
      view: [
        navbar,
        {
          type: 'container',
          showIf: 'user',
          children: [
            'Welcome, {{ user.username }}',
            'Below is a random quote for you:',
            '{{ getQuote.data?.content ?? "Getting your quote..." }}',
            {
              type: 'form',
              form: 'logout'
            }
          ]
        },
        {
          type: 'container',
          styles: { display: 'flex', flexDirection: 'column', gap: '1em' },
          showIf: '!user',
          children: ['Welcome, guest!', 'This is Freebook. You are free to be anyone.', { type: 'form', form: 'login' }]
        }
      ]
    },
    {
      name: 'posts',
      path: '/posts',
      view: [
        navbar,
        { type: 'form', form: 'createPost', params: { author: 'user.username' } },
        {
          name: 'postsList',
          type: 'list',
          itemRef: 'post',
          value: 'getPosts.loading ? [] : getPosts.data',
          container: {
            type: 'container',
            children: [
              '@{{ post.author }} at {{ new Date(post.dateCreated).toLocaleString() }}:',
              '{{ post.content }}',
              {
                type: 'container',
                styles: { display: 'flex', alignItems: 'center', gap: '1em' },
                params: {
                  id: 'post._id',
                  upvoters: 'getUpvotes.loading ? [] : getUpvotes.data'
                },
                children: [
                  {
                    type: 'text',
                    text: 'Upvotes: {{ upvoters.length }}',
                    params: { id: 'post._id' }
                  },
                  {
                    type: 'form',
                    form: 'upvotePost',
                    params: { id: 'post._id' },
                    inline: true,
                    showIf: '!upvoters.includes(user.username)'
                  },
                  {
                    type: 'form',
                    form: 'removeUpvote',
                    params: { id: 'post._id' },
                    inline: true,
                    showIf: 'upvoters.includes(user.username)'
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ]
};

export default app;
