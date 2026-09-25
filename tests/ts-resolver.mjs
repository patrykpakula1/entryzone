// Vercel kompiluje api/ do ESM, gdzie import musi mieć rozszerzenie .js
// (`./_faceit.js`). Node w testach czyta źródła .ts wprost, więc mapujemy
// .js → .ts, gdy pliku .js nie ma.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context)
  } catch (err) {
    if (err?.code === 'ERR_MODULE_NOT_FOUND' && /^\.{1,2}\/.+\.js$/.test(specifier)) {
      return nextResolve(specifier.replace(/\.js$/, '.ts'), context)
    }
    throw err
  }
}
