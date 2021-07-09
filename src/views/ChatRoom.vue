<template>
  <div class="feed" ref="feed">
    <div class="view chat">
        <header>
        <button class="logout" @click="logout">Logout</button>
        <h1>Welcome, {{ authUser.displayName }}</h1>
        </header>
        
        <section class="chat-box">
        <div 
        :key="message.doc" 
        :class="(message.author == authUser.displayName ? 'message current-user' : 'message')"
        v-for="message in messages">
            <div class="message-inner">
            <div class="username">{{ message.author }}</div>
            <div class="content">{{ message.message }}</div>
            </div>
        </div>
        </section>

        <footer>
        <form @submit.prevent="saveMessage">
            <input 
            type="text" 
            v-model="message" 
            placeholder="Write a message..." />
            <input 
            type="submit" 
            value="Send" />
        </form>
        </footer>
    </div>
   </div> 
</template>

<script>
import firebase from 'firebase'

export default {
  name: "PrivateChat",
  data() {
    return {
      message: null,
      messages: [],
      authUser: {}, 
    }
  },

  methods: {
      logout() {
         firebase.auth().signOut().then(() => {
             this.$router.push('/login')
        }).catch((error) => {
        // An error happened.
        });
      },

    scrollToBottom() {
      setTimeout(() => {
			this.$refs.feed.scrollTop = this.$refs.feed.scrollHeight - this.$refs.feed.clientHeight;
		}, 50);
    },

    saveMessage() {
      //save to firestore
      // eslint-disable-next-line no-undef
      db.collection('chat').add({
        message: this.message,
        author: this.authUser.displayName,
        createdAt: new Date(),
      }).then(() => {
        this.scrollToBottom();
      })

      this.message = null
    },

    fetchMessages() {
      // eslint-disable-next-line no-undef
      db.collection('chat').orderBy('createdAt').onSnapshot((querySnapshot) => {
        let allMessages = [];
        querySnapshot.forEach(doc => {
          // console.log(`${doc.id} => ${doc.data()}`);
          allMessages.push(doc.data())
        })
        this.messages = allMessages;

        
        this.scrollToBottom();
        
      })
    }
  },

  created() {

    firebase.auth().onAuthStateChanged(user => {

      if(user) {
        this.authUser = user;
      } else {
        this.authUser = {}
      }

    })
    this.fetchMessages();
  },

  beforeRouteEnter(to,from,next) {
    next(vm => {
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          next();
        } else {
          vm.$router.push('/login');
        }
      })
    })
  },
};
</script>


<style lang="scss">
.feed {
		background: #f0f0f0;
		max-height: 100vh;
		overflow: scroll;
	}

* {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.view {
	display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #ea526f;
	
	&.login {
		align-items: center;
		.login-form {
			display: block;
			width: 100%;
			padding: 15px;
			
			.form-inner {
				display: block;
				background-color: #FFF;
				padding: 50px 15px;
				border-radius: 16px;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
				h1 {
					color: #AAA;
					font-size: 28px;
					margin-bottom: 30px;
				}
				label {
					display: block;
					margin-bottom: 5px;
					color: #AAA;
					font-size: 16px;
					transition: 0.4s;
				}
				input[type="text"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px;
					margin-bottom: 15px;
					
					color: #333;
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;
					transition: 0.4s;
					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					background-color: #ea526f;
					border-radius: 8px;
					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
				&:focus-within {
					label {
						color: #ea526f;
					}
					input[type="text"] {
						background-color: #FFF;
						box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
						&::placeholder {
							color: #666;
						}
					}
				}
			}
		}
	}
	&.chat {
		flex-direction: column;
		header {
			position: relative;
			display: block;
			width: 100%;
			padding: 50px 30px 10px;
			.logout {
				position: absolute;
				top: 15px;
				right: 15px;
				appearance: none;
				border: none;
				outline: none;
				background: none;
				
				color: #FFF;
				font-size: 18px;
				margin-bottom: 10px;
				text-align: right;
			}
			h1 {
				color: #FFF;
			}
		}
		.chat-box {
			border-radius: 24px 24px 0px 0px;
			background-color: #FFF;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			flex: 1 1 100%;
			padding: 30px;
			.message {
				display: flex;
				margin-bottom: 15px;
				
				.message-inner {
					.username {
						color: #888;
						font-size: 16px;
						margin-bottom: 5px;
						padding-left: 15px;
						padding-right: 15px;
					}
					.content {
						display: inline-block;
						padding: 10px 20px;
						background-color: #F3F3F3;
						border-radius: 999px;
						color: #333;
						font-size: 18px;
						line-height: 1.2em;
						text-align: left;
					}
				}
				&.current-user {
					margin-top: 30px;
					justify-content: flex-end;
					text-align: right;
					.message-inner {
						max-width: 75%;
						.content {
							color: #FFF;
							font-weight: 600;
							background-color: #ea526f;
						}
					}
				}
			}
		}
		footer {
			position: sticky;
			bottom: 0px;
			background-color: #FFF;
			padding: 30px;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			form {
				display: flex;
				input[type="text"] {
					flex: 1 1 100%;
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px 0px 0px 8px;
					
					color: #333;
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;
					transition: 0.4s;
					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					padding: 10px 15px;
					border-radius: 0px 8px 8px 0px;
					background-color: #ea526f;
					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}

</style>
