<!-- src/routes/+page.svelte -->
<script>
    import { goto } from '$app/navigation';


  async function downloadExcel() {
    try {
      const response = await fetch('/api/download-excel');
      if (!response.ok) {
        throw new Error('Error downloading the Excel file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition').split('filename=')[1];
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  }

</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Toma de Inventario Fisico</h1>
    <div class="flex flex-col space-y-2">
        <button class="bg-blue-500 text-white p-2 rounded" on:click={() => goto('/carga-datos-excel')}>Carga Datos Excel</button>
        <button class="bg-blue-500 text-white p-2 rounded" on:click={() => goto('/toma-inventario')}>Toma de Inventario</button>
        <button  class="bg-blue-500 text-white p-2 rounded" on:click={downloadExcel} >Descarga de Datos Excel</button>
        <button class="bg-green-500 text-white p-2 rounded" on:click={() => goto('/reporte-carga-excel')}>Reporte de Carga Excel</button>
        <button class="bg-green-500 text-white p-2 rounded" on:click={() => goto('/admin-inventario')}>Administracion de Toma de Inventario</button>
        <button class="bg-green-500 text-white p-2 rounded" on:click={() => goto('/categorias-incidencias')}>Categorias de Incidencias</button>
    </div>
</div>
