<script>
    import { onMount, onDestroy, tick } from 'svelte';
    import { BrowserMultiFormatReader } from '@zxing/browser';
  
    let bodegas = [];
    let marcas = [];
    let selectedBodega = '';
    let selectedMarca = '';
    let ubicacion = '';
    let codigoBarra = '';
    let product = null;
    let stockQuantity = 0;
    let incidencia = '';
    let scanner = null;
    let isScanning = false;
    let scanningType = ''; // 'ubicacion' or 'codigoBarra'
  
    // Fetch bodegas on mount
    onMount(async () => {
      try {
        const res = await fetch('/api/bodegas');
        const response = await res.json();
        bodegas = response.bodegas || [];
      } catch (error) {
        console.error('Error fetching bodegas:', error);
      }
    });
  
    onDestroy(() => {
      stopScanner(); // Cleanup scanner when component is destroyed
    });
  
    // Fetch marcas based on selected bodega
    async function fetchMarcas() {
      if (!selectedBodega) return;
  
      try {
        const res = await fetch(`/api/marcas?bodega=${selectedBodega}`);
        const data = await res.json();
        marcas = data.marcas || [];
      } catch (error) {
        console.error('Error fetching marcas:', error);
      }
    }
  
    // Start the scanner
    async function startScanner(type) {
      scanningType = type;
      isScanning = true;
  
      // Ensure the video element is rendered
      await tick();
  
      const videoElement = document.getElementById('scanner-video');
      if (!videoElement) {
        console.error('Scanner video element not found');
        return;
      }
  
      scanner = new BrowserMultiFormatReader();
  
      try {
        await scanner.decodeFromVideoDevice(
          null,
          videoElement,
          (result) => {
            if (result) {
              if (type === 'ubicacion') {
                ubicacion = result.getText();
                stopScanner(); // Stop scanner after scanning ubicacion
              } else if (type === 'codigoBarra') {
                codigoBarra = result.getText();
                stopScanner(); // Stop scanner after scanning codigo_barra
              }
            }
          }
        );
      } catch (error) {
        console.error('Error initializing scanner:', error);
        stopScanner();
      }
    }
  
    // Stop the scanner
    function stopScanner() {
      if (scanner) {
        scanner.reset();
        scanner = null;
      }
      isScanning = false;
      scanningType = '';
    }
  
    // Reset all fields
    function resetFields() {
      product = null;
      ubicacion = '';
      codigoBarra = '';
      stockQuantity = 0;
      incidencia = '';
      isScanning = false;
      scanningType = '';
    }
  
    // Fetch product details
    async function fetchProduct() {
      if (!selectedBodega || !selectedMarca || !ubicacion || !codigoBarra) return;
  
      try {
        const res = await fetch(`/api/producto?bodega=${selectedBodega}&marca=${selectedMarca}&codigo_barra=${codigoBarra}`);
  
        if (!res.ok) {
          throw new Error(`Error fetching product: ${res.statusText}`);
        }
  
        const data = await res.json();
  
        if (data.product && data.product.length > 0) {
          product = data.product[0];
          stockQuantity = product.inventario_fisico;
          incidencia = product.incidencia || '';
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
  </script>
  
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Inventory Management</h1>
  
    <!-- Bodega Selection -->
    <div class="mb-4">
      <label for="bodega" class="block text-sm font-medium text-gray-700">Select Bodega</label>
      <select
        id="bodega"
        bind:value={selectedBodega}
        on:change={fetchMarcas}
        class="block w-full mt-1 p-2 border border-gray-300 rounded">
        <option value="">Select a Bodega</option>
        {#each bodegas as bodega}
          <option value={bodega}>{bodega}</option>
        {/each}
      </select>
    </div>
  
    <!-- Marca Selection -->
    {#if selectedBodega}
      <div class="mb-4">
        <label for="marca" class="block text-sm font-medium text-gray-700">Select Marca</label>
        <select id="marca" bind:value={selectedMarca} class="block w-full mt-1 p-2 border border-gray-300 rounded">
          <option value="">Select a Marca</option>
          {#each marcas as marca}
            <option value={marca}>{marca}</option>
          {/each}
        </select>
      </div>
    {/if}
  
    <!-- Scan Ubicación Button -->
    {#if selectedBodega && selectedMarca && !isScanning && !ubicacion}
      <button
        on:click={() => startScanner('ubicacion')}
        class="mt-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
        Scan Ubicación
      </button>
    {/if}
  
    <!-- Display Ubicación -->
    {#if ubicacion}
      <div class="mb-4">
        <label for="ubicacion-display" class="block text-sm font-medium text-gray-700">Ubicación</label>
        <input
          id="ubicacion-display"
          type="text"
          bind:value={ubicacion}
          readonly
          class="p-2 bg-white border border-gray-300 rounded w-full" />
      </div>
    {/if}
  
    <!-- Scan Código de Barra Button -->
    {#if ubicacion && !isScanning && !codigoBarra}
      <button
        on:click={() => startScanner('codigoBarra')}
        class="mt-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded">
        Scan Código de Barra
      </button>
    {/if}
  
    <!-- Display Código de Barra -->
    {#if codigoBarra}
      <div class="mb-4">
        <label for="codigo-barra-display" class="block text-sm font-medium text-gray-700">Código de Barra</label>
        <input
          id="codigo-barra-display"
          type="text"
          bind:value={codigoBarra}
          readonly
          class="p-2 bg-white border border-gray-300 rounded w-full" />
      </div>
    {/if}
  
    <!-- Scanner Video Element -->
    {#if isScanning}
      <div class="mt-4">
        <video
          id="scanner-video"
          class="w-full border border-gray-300 rounded"
          autoplay
          muted
          playsinline></video>
      </div>
    {/if}
  </div>
  