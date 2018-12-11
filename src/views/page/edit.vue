<template>
  <page-detail :is-edit='true'></page-detail>
</template>

<script>
import PageDetail from './components/PageDetail'

export default {
  name: 'editPage',
  components: { PageDetail }
}
</script>