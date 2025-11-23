// script.js
(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const form = $('#formSuscripcion');
  const btnSubmit = $('#btnSuscribir');
  const btnLimpiar = $('#btnLimpiar');
  const out = $('#mensaje');

  const inputsRequeridos = [
    $('#nombre'),
    $('#apellido'),
    $('#password'),
    $('#email'),
    $('#edad'),
  ];

  // Helpers de validación simple
  const mostrarAyuda = (input, ok, idAyuda) => {
    const ayuda = document.getElementById(idAyuda);
    if (!ayuda) return;
    ayuda.hidden = ok;
  };

  const validarCampo = (input) => {
    if (input === $('#password')) {
      const ok = input.value.trim().length >= 8;
      mostrarAyuda(input, ok, 'ayuda-password');
      return ok;
    }
    if (input === $('#email')) {
      const ok = input.validity.valid; // usa validación nativa de email
      mostrarAyuda(input, ok, 'ayuda-email');
      return ok;
    }
    if (input === $('#edad')) {
      const v = Number(input.value);
      const ok = Number.isFinite(v) && v >= 1 && v <= 120;
      mostrarAyuda(input, ok, 'ayuda-edad');
      return ok;
    }
    // nombre / apellido
    const ok = input.value.trim().length > 0;
    if (input === $('#nombre')) mostrarAyuda(input, ok, 'ayuda-nombre');
    if (input === $('#apellido')) mostrarAyuda(input, ok, 'ayuda-apellido');
    return ok;
  };

  const validarGenero = () => {
    const ok = $$('input[name="genero"]').some(r => r.checked);
    const ayuda = $('#ayuda-genero');
    if (ayuda) ayuda.hidden = ok;
    return ok;
  };

  const validarFormulario = () => {
    const okCampos = inputsRequeridos.every(validarCampo);
    const okGenero = validarGenero();
    const ok = okCampos && okGenero;
    btnSubmit.disabled = !ok;
    return ok;
  };

  // Eventos de entrada en tiempo real
  inputsRequeridos.forEach(inp => {
    inp.addEventListener('input', validarFormulario);
    inp.addEventListener('blur', () => validarCampo(inp));
  });
  $$('input[name="genero"]').forEach(r =>
    r.addEventListener('change', validarFormulario)
  );

  // Envío
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    out.textContent = '';

    if (!validarFormulario()) {
      out.textContent = 'Revisa los campos marcados.';
      out.style.color = '#fee2e2';
      return;
    }

    // Construir payload
    const data = {
      nombre: $('#nombre').value.trim(),
      apellido: $('#apellido').value.trim(),
      password: $('#password').value, // en real, jamás lo mandes en claro sin TLS
      email: $('#email').value.trim(),
      edad: Number($('#edad').value),
      genero: ($$('input[name="genero"]').find(r => r.checked) || {}).value || '',
      intereses: $$('input[name="intereses"]:checked').map(c => c.value),
      fecha: new Date().toISOString(),
    };

    // Simular envío (aquí iría fetch/axios)
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando…';

    try {
      await new Promise(res => setTimeout(res, 800)); // simulación

      // TODO: Reemplaza por tu endpoint
      // await fetch('/api/suscripcion', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });

      out.textContent = `¡Gracias, ${data.nombre}! Te has suscrito correctamente.`;
      out.style.color = '#d1fae5';

      form.reset();
      validarFormulario(); // deshabilita otra vez
    } catch (e) {
      console.error(e);
      out.textContent = 'Ocurrió un error al enviar. Intenta de nuevo.';
      out.style.color = '#fee2e2';
      btnSubmit.disabled = false;
    } finally {
      btnSubmit.textContent = 'Suscribirse';
    }
  });

  // Limpiar
  btnLimpiar.addEventListener('click', () => {
    form.reset();
    // Ocultar ayudas
    ['ayuda-nombre','ayuda-apellido','ayuda-password','ayuda-email','ayuda-edad','ayuda-genero']
      .forEach(id => { const el = document.getElementById(id); if (el) el.hidden = true; });
    out.textContent = '';
    validarFormulario();
  });

  // Estado inicial
  validarFormulario();
})();