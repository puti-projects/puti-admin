<template>
  <editor :edit-type="'note'"></editor>
</template>

<script>
import Editor from './components/Editor'

export default {
  name: 'updateKnowledge',
  components: { Editor }
}
</script>