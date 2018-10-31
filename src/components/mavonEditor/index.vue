<template>
    <mavon-editor style="height: 100%"></mavon-editor>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'editor',
  components: { mavonEditor }
}
</script>