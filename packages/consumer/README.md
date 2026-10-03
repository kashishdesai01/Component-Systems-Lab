# Packed consumer fixture

This small Vite application imports only the UI package's declared exports and
stylesheet. Its dependency points at `artifacts/csl-ui-0.1.0.tgz`, produced by
packing the built package. Run the repository's consumer verification script to
build and install that archive before building this fixture.

The tarball must resolve all runtime and type dependencies without importing
unpublished workspace source. Browser verification should check the controlled
input and the dialog's initial and restored focus. A successful production build
alone does not prove those interactions work.
