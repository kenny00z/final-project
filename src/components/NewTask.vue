<template>
  <div class="new-task-container">
    <h1 class="main-title">Add a new Quest!</h1>
    <div v-if="showErrorMessage">
      <p class="error-text">{{ errorMessage }}</p>
    </div>
    <div :class="theme">
      <div class="input-field-task">
        <input
          type="text"
          placeholder="Add a Quest Title"
          v-model="name"
          maxlength="24"
        />
      </div>
      <div class="input-field-task">
        <input
          type="text"
          placeholder="Add a Quest Description"
          v-model="description"
          maxlength="48"
        />
      </div>
      <button @click="addTask" :class="themeBtn">Add Quest</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTaskStore } from "../stores/task";
import { useThemeStore } from "../stores/theme";
import { useUserStore } from "../stores/user";

const theme = computed(() => {
  return userStore.theme === "light"
    ? "add-task-container-light"
    : "add-task-container-dark";
});

const themeBtn = computed(() => {
  return userStore.theme === "light"
    ? "add-quest-button-light"
    : "add-quest-button-dark";
});

const taskStore = useTaskStore();
const userStore = useUserStore();
// variables para los valors de los inputs
const name = ref("");
const description = ref("");

// constant to save a variable that holds an initial false boolean value for the errorMessage container that is conditionally displayed depending if the input field is empty
const showErrorMessage = ref(false);

// const constant to save a variable that holds the value of the error message
const errorMessage = ref(null);
const emit = defineEmits(["getTasks"]);
// Arrow function para crear tareas.
const addTask = async () => {
  if (name.value.length === 0 || description.value.length === 0) {
    // Primero comprobamos que ningún campo del input esté vacío y lanzamos el error con un timeout para informar al user.

    showErrorMessage.value = true;
    errorMessage.value = "The task title or description is empty";
    setTimeout(() => {
      showErrorMessage.value = false;
    }, 5000);
  } else {
    // Aquí mandamos los valores a la store para crear la nueva Task. Esta parte de la función tenéis que refactorizarla para que funcione con emit y el addTask del store se llame desde Home.vue.
    // opcion 1 newtask desde el padre, o pasar desde el padre get taskts a newtasks,
    //

    await taskStore.addTask(name.value, description.value);
    name.value = "";
    description.value = "";
    emit("getTasks");
  }
};
</script>

<style></style>
