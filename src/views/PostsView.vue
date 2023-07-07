<template>
  <div class="box table-box">
    <div class="header-container">
      <h3 class="section-header">Posts</h3>
    </div>
    <div class="box-container">
      <div class="row align-items-center mb-3">
        <div v-if="toastrMessage" class="col-md-12">
          <div class="alert" :class="toastrType" role="alert">
            {{toastrMessage}}
          </div>
        </div>
        <div class="col-md-9">
          <div action="#" class="search w-100">
            <svg
              class="search__icon"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5418 19.25C15.3513 19.25 19.2502 15.3512 19.2502 10.5417C19.2502 5.73223 15.3513 1.83337 10.5418 1.83337C5.73235 1.83337 1.8335 5.73223 1.8335 10.5417C1.8335 15.3512 5.73235 19.25 10.5418 19.25Z"
                stroke="#596780"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.1668 20.1667L18.3335 18.3334"
                stroke="#596780"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              type="text"
              class="search__input"
              v-model="searchQuery" 
              @input="performSearch"
              placeholder="Search something here"
            />
          </div>
        </div>
        <div class="col-md-3">
          <button @click="OpenCreateModal" class="btn add_btn w-100" 
            >Create post</button
          >
        </div>
      </div>
      <div class="table-responsive">
        <table v-if="posts.length > 0" class="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Post description</th>
              <th>Post name</th>
              <th>Post Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in searchQuery !== null ? resultPosts : posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.post_message }}</td>
              <td>{{ post.post_title }}</td>
              <td>
                <img
                  :src="post.post_image"
                  width="50"
                  height="50"
                  :alt="post.post_title"
                />
              </td>
              <td>
                <div class="d-flex">
                  <button class="action_button btn btn-info"
                  @click="updateBtn(post)"
                  type="button">
                    <img src="../assets/edit.svg" alt="" />
                  </button>
                  <b-button
                    ref="btnDelete"
                    class="action_button btn btn-danger"
                    @click="deleteBtn(post.id)"
                    type="button"
                  >
                    <img src="../assets/trash.svg" alt="" />
                  </b-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
  
      <div class="" v-if="posts.length === 0">
        <h3 class="text-center">No data is here</h3>
      </div>
    </div>
    <div
      id="my-modal"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="my-modal-title"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="my-modal-title">Title</h5>
            <button class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Content</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-component" :class="{ 'show-modal': activeModalCreate }">
      
      <div class="modal-content">
        <span class="close-button" @click="closeCreateModal">&times;</span>
        <h5 class="modal-title" id="my-modal-title">Create post</h5>
        <hr />
        <form @submit.prevent="onCreate">
          <div class="form-group mb-3">
            <label for="post_name">Post name</label>
            <input
              id="post_name"
              v-model="post_name"
              class="form-control"
              type="text"
              name="post_name"
              @blur="touchField('post_name')"
            />
            <div v-if="validation.post_name.$error">
              {{ validation.post_name.$errors[0].$message }}
            </div>
          </div>
          <div class="form-group mb-3">
            <label for="postImage">Post Image</label>
            <input
              id="postImage"
              accept="image/*"
              @change="onSelectImage($event)"
              class="form-control"
              ref="fileInput"
              type="file"
              name="postImage"
            />
            <!-- <div v-if="validation.post_image.$error">
          {{validation.post_image.$errors[0].$message}}
          </div> -->
          </div>
          <div class="form-group mb-3">
            <label for="post_description">Post Description</label>
            <textarea
              id="post_description"
              v-model="post_description"
              class="form-control"
              type="text"
              name="post_description"
              @blur="touchField('post_description')"
            ></textarea>
            <div v-if="validation.post_description.$error">
              {{ validation.post_description.$errors[0].$message }}
            </div>
          </div>
          <div class="form-group mb-3">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="validation.$invalid"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-component" :class="{ 'show-modal': activeUpdateModal }">
      
      <div class="modal-content">
        <span class="close-button" @click="closeUpdateModal">&times;</span>
        <h5 class="modal-title" id="my-modal-title">Update post</h5>
        <hr />
        <form @submit.prevent="onUpdate">
          <div class="form-group mb-3">
            <label for="post_name">Post name</label>
            <input
              id="post_name"
              v-model="post_name"
              class="form-control"
              type="text"
              name="post_name"
              @blur="touchField('post_name')"
            />
            <div v-if="validation.post_name.$error">
              {{ validation.post_name.$errors[0].$message }}
            </div>
          </div>
          <div class="form-group mb-3">
            <label for="postImage">Post Image</label>
            <input
              id="postImage"
              accept="image/*"
              @change="onSelectImage($event)"
              class="form-control"
              ref="fileInput"

              type="file"
              name="postImage"
            />
            <!-- <div v-if="validation.post_image.$error">
          {{validation.post_image.$errors[0].$message}}
          </div> -->
          </div>
          <div class="form-group mb-3">
            <label for="post_description">Post Description</label>
            <textarea
              id="post_description"
              v-model="post_description"
              class="form-control"
              type="text"
              name="post_description"
              @blur="touchField('post_description')"
            ></textarea>
            <div v-if="validation.post_description.$error">
              {{ validation.post_description.$errors[0].$message }}
            </div>
          </div>
          <div class="form-group mb-3">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="validation.$invalid"
            >
              Update
            </button>
            
          </div>
        </form>
      </div>
    </div>

    <div class="modal-component" :class="{ 'show-modal': activeModalDelete }">
      
      <div class="modal-content">
        <span class="close-button" @click="closeDeleteModal">&times;</span>
        <h5 class="modal-title" id="my-modal-title">Delete post</h5>
        <hr />
        Delete post ?
        <hr>
        <button class="btn btn-danger" @click="onDeletePost">Delete</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

// import the root component App from a single-file component.

export default {
  /* root component options */
  data() {
    return {
      validation: useVuelidate(),
      post_name: null,
      post_image: null,
      post_description: null,
      searchQuery: null,
      posts: [],
      resultPosts: [],
      activeModalDelete: false,
      activeModalCreate: false,
      activeUpdateModal: false,
      clickActionId: null,
      toastrMessage:null,
      toastrType: null    
    };
  },
  created() {
    this.getPosts();
  },
  methods: {
    touchField(field) {
      console.log(field);
      console.log("==>", this.validation);
      this.validation[field].$touch();
    },
    onSelectImage(event) {
      console.log("on change image", event.target.files[0]);
      let image = event.target.files[0];
      this.post_image = image;
    },
    performSearch() {
      if(this.searchQuery !== '' || this.searchQuery !== null){
        this.resultPosts = this.posts.filter((item) =>
          Object.values(item).some(value =>
            value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        )
      }else{
        this.resultPosts = this.posts;
      }
    },
    OpenCreateModal(){
      this.activeModalCreate = true
    },
    closeCreateModal(){
      this.activeModalCreate = false
      this.post_name = "";
      this.post_description = "";
      this.post_image = "";
      this.validation.$reset();
    },
    closeUpdateModal(){
      this.activeUpdateModal = false
      this.post_name = "";
      this.post_description = "";
      this.post_image = "";
      this.validation.$reset();
    },
    closeDeleteModal(){
      this.activeModalDelete = false
    },
    deleteBtn(postId) {
      console.log("post id", postId);
      this.activeModalDelete = true;
      this.clickActionId = postId
      
    },
    updateBtn(post) {
      console.log("post object", post);
      this.activeUpdateModal = true;
      this.clickActionId = post.id
      this.post_name = post.post_title
      this.post_description = post.post_message
      
    },
    onDeletePost(){
      console.log(this.clickActionId)


      axios.post(
        `https://task.astra-tech.net/fronendtask/public/api/deletepost`,
        {id: this.clickActionId}).then((responsePost) => {
        console.log('response in delete' , responsePost)
        this.activeModalDelete = false
        this.getPosts()
        this.toastrMessage = 'Post deleted successfully'
            this.toastrType = 'alert-danger'
      }).catch((responseError) => {
        console.log('error in delete' , responseError)
      })
    },

    onUpdate(){
      console.log('onUpdate ==>',this.post_name, this.post_description, this.post_image , this.clickActionId);
      const formData = new FormData();
      formData.append("id", this.clickActionId);
      formData.append("post_title", this.post_name);
      formData.append("post_message", this.post_description);
      if(this.post_image !== null){
        formData.append("post_image", this.post_image);
      }
      axios
        .post(
          `https://task.astra-tech.net/fronendtask/public/api/updatepost`,
          formData
        )
        .then((postData) => {
          console.log("posted successfuly", postData);
          if (postData.data === "Done") {
            this.post_name = null;
            this.post_description = null;
            this.post_image = null;
            this.activeUpdateModal = false
            this.validation.$reset();
            this.getPosts();
            this.toastrMessage = 'Post updated successfully'
            this.toastrType = 'alert-success'
            this.$refs.fileInput.value = '';

          }
        })
        .catch((errorPost) => {
          console.log("posted error", errorPost);
        });
    },
    

    onCreate(event) {
      console.log("submittt -->", event);
      console.log(this.post_name, this.post_description, this.post_image);
      const formData = new FormData();
      formData.append("post_title", this.post_name);
      formData.append("post_message", this.post_description);
      formData.append("post_image", this.post_image);

      axios
        .post(
          `https://task.astra-tech.net/fronendtask/public/api/create`,
          formData
        )
        .then((postData) => {
          console.log("posted successfuly", postData);
          if (postData.data === "Done") {
            this.post_name = null;
            this.post_description = null;
            this.post_image = null;
            this.activeModalCreate = false
            this.validation.$reset();
            this.getPosts();
            this.toastrMessage = 'Post Created successfully'
            this.toastrType = 'alert-success'
            let postImage = document.querySelector('#postImage')
            postImage.value = ''

          }
        })
        .catch((errorPost) => {
          console.log("posted error", errorPost);
        });
    },

    getPosts() {
      axios
        .get(`https://task.astra-tech.net/fronendtask/public/api/getposts`)
        .then((postsData) => {
          console.log(postsData);
          this.posts = postsData.data;
        })
        .catch((errorPosts) => {
          console.log(errorPosts);
        });
    },
  },
  validations() {
    return {
      post_name: { required, minLength: minLength(3) },
      post_description: { required, minLength: minLength(3) },
    };
  },
};
</script>
<style>

</style>
