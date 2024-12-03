<script>
  import { onMount } from 'svelte';

  let bodegas = [];
  let marcas = []; // Change this to 'let' so it can be reassigned
  let selectedBodega = '';
  let selectedMarca = '';
  let codigoBarra = '';
  let ubicacion = ''; // New field for location
  let product = null; // Single product data
  let stockQuantity = 0;
  let note = '';

  // Fetch bodegas when the page loads
  onMount(async () => {
      try {
          const res = await fetch('/api/bodegas');
          const response = await res.json();
          bodegas = response.bodegas || [];
      } catch (error) {
          console.error('Error fetching bodegas:', error);
      }
  });

  // Fetch marcas when bodega is selected
  async function fetchMarcas() {
    if (!selectedBodega) return;

    try {
        const res = await fetch(`/api/marcas?bodega=${selectedBodega}`);
        const data = await res.json();
        marcas = data.marcas || []; // Correctly assign to the 'marcas' variable
    } catch (error) {
        console.error('Error fetching marcas:', error);
    }
}

  // Fetch product details based on bodega, marca, ubicacion, and codigo_barra
  async function fetchProduct() {
    if (!selectedBodega || !selectedMarca || !ubicacion || !codigoBarra) return;

    try {
        const res = await fetch(`/api/producto?bodega=${selectedBodega}&marca=${selectedMarca}&codigo_barra=${codigoBarra}`);
        
        if (!res.ok) {
            throw new Error(`Error fetching product: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.product && data.product.length > 0) {
            product = data.product[0]; // Assuming there's only one result
            stockQuantity = product.inventario_fisico;
            inote = product.notes || ''; // Set the note from the response or default to empty string
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}


  // Save updated stock and notes
  async function saveChanges() {
      if (!product) {
          alert('No product to save changes.');
          return;
      }

      try {
          const res = await fetch(`/api/producto/${product.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  inventario_fisico: stockQuantity,
                  notes: note,
              }),
          });

          if (res.ok) {
              alert('Product updated successfully!');
          } else {
              alert('Failed to update product.');
          }
      } catch (error) {
          console.error('Error saving product:', error);
      }
  }
</script>

<div>
  <!-- Warehouse Selection Dropdown -->
  <label for="bodega">Select Bodega:</label>
  <select id="bodega" bind:value={selectedBodega} on:change={fetchMarcas}>
      <option value="">Select a Bodega</option>
      {#each bodegas as bodega}
          <option value={bodega}>{bodega}</option>
      {/each}
  </select>
</div>

{#if selectedBodega}
  <!-- Brand Selection Dropdown -->
  <div>
      <label for="marca">Select Marca:</label>
      <select id="marca" bind:value={selectedMarca}>
          <option value="">Select a Marca</option>
          {#each marcas as marca}
              <option value={marca}>{marca}</option>
          {/each}
      </select>
  </div>
{/if}

{#if selectedBodega && selectedMarca}
  <!-- Ubicacion (Location) Input -->
  <div>
      <label for="ubicacion">Ubicación:</label>
      <input 
          type="text" 
          id="ubicacion" 
          bind:value={ubicacion} 
          placeholder="Enter location" 
      />
  </div>
{/if}

{#if selectedBodega && selectedMarca && ubicacion}
  <!-- Barcode Input Field -->
  <div>
      <label for="codigoBarra">Enter Barcode:</label>
      <input 
          type="text" 
          id="codigoBarra" 
          bind:value={codigoBarra} 
          placeholder="Enter barcode" 
      />
  </div>
{/if}

<!-- Search Button -->
<button on:click={fetchProduct} class="mt-4 bg-blue-500 text-white p-2 rounded">
  Search Product
</button>

{#if product}
  <!-- Product Details -->
  <div>
      <h3>Product: {product.descripcion}</h3>
      <p><strong>GTIN:</strong> {product.gtin}</p>
      <p><strong>Código de Barras:</strong> {product.codigo_barras}</p>

      <!-- Stock Quantity Input -->
      <label for="stock">Inventario Físico:</label>
      <input 
          type="number" 
          id="stock" 
          bind:value={stockQuantity} 
          class="p-2 border border-gray-300 rounded"
      />

      <!-- Notes Input -->
      <label for="notes">Notas:</label>
      <textarea 
          id="notes" 
          bind:value={note} 
          class="p-2 border border-gray-300 rounded"
      ></textarea>

      <!-- Save Changes Button -->
      <button on:click={saveChanges} class="mt-4 bg-blue-500 text-white p-2 rounded">Save Changes</button>
  </div>
{:else}
  <p>No product found. Please select a bodega, marca, ubicacion, and barcode.</p>
{/if}
