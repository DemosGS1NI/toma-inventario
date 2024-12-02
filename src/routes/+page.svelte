<!-- src/routes/+page.svelte -->
<script>
    import { goto } from '$app/navigation';
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Toma de Inventario Fisico</h1>
    <div class="flex flex-col space-y-2">
        <button class="bg-blue-500 text-white p-2 rounded" on:click={() => goto('/carga-excel')}>Carga Datos Excel</button>
        <button class="bg-blue-500 text-white p-2 rounded" on:click={() => goto('/toma-inventario')}>Toma de Inventario</button>
        <button class="bg-blue-500 text-white p-2 rounded" on:click={() => goto('/descarga-excel')}>Descarga de Datos Excel</button>
        <button class="bg-green-500 text-white p-2 rounded" on:click={() => goto('/reporte-carga-excel')}>Reporte de Carga Excel</button>
    </div>
</div>
