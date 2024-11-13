<template>

</template>
<script setup>
import axios from 'axios';

    const getCinemas = ()=>{
        const cinemas = axios.get("/api/v1/venues")
            .then(r=>{
                return r.data
        })
    }
</script>