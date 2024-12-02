<!-- src/routes/reporte-carga-excel/+page.svelte -->
<script>
    export let reportData;
  </script>
  
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Reporte de Carga Excel</h1>
  
    {#if reportData && reportData.length > 0}
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-2 border">ID</th>
            <th class="px-4 py-2 border">Código Barras</th>
            <th class="px-4 py-2 border">GTIN</th>
            <th class="px-4 py-2 border">Bodega</th>
            <th class="px-4 py-2 border">Ubicación</th>
            <th class="px-4 py-2 border">Marca</th>
            <th class="px-4 py-2 border">Número Parte</th>
            <th class="px-4 py-2 border">Descripción</th>
            <th class="px-4 py-2 border">Inventario Sistema</th>
          </tr>
        </thead>
        <tbody>
          {#each reportData as item}
            <tr>
              <td class="px-4 py-2 border">{item.id}</td>
              <td class="px-4 py-2 border">{item.codigo_barras}</td>
              <td class="px-4 py-2 border">{item.gtin}</td>
              <td class="px-4 py-2 border">{item.bodega}</td>
              <td class="px-4 py-2 border">{item.ubicacion}</td>
              <td class="px-4 py-2 border">{item.marca}</td>
              <td class="px-4 py-2 border">{item.numero_parte}</td>
              <td class="px-4 py-2 border">{item.descripcion}</td>
              <td class="px-4 py-2 border">{item.inventario_sistema}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>No data available.</p>
    {/if}
  </div>
  