import { defineStore } from "pinia";
import { supabase } from "../supabase";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    profile: null,
    theme: "light",

    //THIS SE USA PARA APUNTAR A LAS VARIABLES DEL ESTADO DE MI STORE (POR PINIA)
  }),
  actions: {
    async fetchUser() {
      const user = await supabase.auth.user();
      if (user) {
        this.user = user;
        const { data: profile } = await supabase
          .from("profiletable")
          .select("*")
          .eq("user_id", this.user.id);
        // .match({ user_id: this.user.id });

        // if (profile) this.profile = profile[0];
        // console.log("profile in store: ", this.profile);

        if (profile) {
          this.profile = profile[0];
          console.log("profile in store: ", this.profile);
          console.log(this.profile.theme);
          if (this.profile.theme) this.theme = "dark";
          else this.theme = "light";
        }
      }
    },

    async signUp(email, password) {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      if (user) {
        this.user = user;

        const { data: profile } = await supabase.from("profiletable").insert([
          {
            // aquí modificamos la entrada de las cosas
            user_id: this.user.id,
            email: email,
            // username: email,
          },
        ]);
      }
    },

    async signIn(email, password) {
      const { user, error } = await supabase.auth.signIn(
        {
          email: email,
          password: password,
        },
        {
          shouldCreateUser: false,
        }
      );
      if (error) throw error;
      if (user) {
        this.user = user;
        const { data: profile } = await supabase
          .from("profiletable")
          .select()
          .match({ user_id: this.user.id });

        if (profile) this.profile = profile[0];
      }
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    async refreshProfile(name, username, avatar_url, id) {
      console.log(name + username + avatar_url + id);
      const { data, error } = await supabase
        .from("profiletable")
        .update([
          {
            name: name,
            username: username,
            avatar_url: avatar_url,
          },
        ])
        .match({
          user_id: id,
        });
    },
    async toogleTheme() {
      console.log(
        "En store estoy recibiendo para mandar a supabase: ",
        this.profile.theme
      );
      const { data, error } = await supabase
        .from("profiletable")
        .update({
          theme: !this.profile.theme,
        })
        .match({
          user_id: this.user.id,
        });
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
      },
    ],
  },
});
