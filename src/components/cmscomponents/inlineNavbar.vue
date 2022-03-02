<template>
  <div class="tree-layout">
    <div class="tree">
      <div class="site-toolbar">
        <span class="el-icon-refresh" @click="reflash()">刷新</span>
        <span class="el-icon-plus" v-if="add" @click="addClick()">添加</span>
      </div>
      <el-tree :data="nodes" ref="inlineNavbar"  :props="props" @node-click="nodeClik" :default-expanded-keys="[]" :indent="16" node-key="id"></el-tree>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        props: {
          label: "name",
          children: "children",
          // isLeaf: "hasChild",
          id: "id"
        },
        data:[],
    };
  },
  props: {
    nodes: {
      type: Array,
      default: []
    },
    add: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    nodeClik(data) {
      this.$emit("node-click",data);
    },
    reflash(data) {
      this.$emit('reflash', data)
    },
    addClick(data) {
      this.$emit('add', data)
    }
  }
};
</script>

<style>

</style>
