
var Buildings = {};

(function() {

  var shader;

  Buildings.initShader = function() {
    shader = new Shader('buildings');
  };

  Buildings.render = function(mapMatrix) {
    if (Map.zoom < MIN_ZOOM) {
      return;
    }

//  gl.enable(gl.BLEND);
//  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
//  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//  gl.disable(gl.DEPTH_TEST);

    shader.use();

    // TODO: suncalc
    gl.uniform3fv(shader.uniforms.uLightColor, [0.5, 0.5, 0.5]);
    gl.uniform3fv(shader.uniforms.uLightDirection, unit(1, 1, 1));

    gl.uniform1f(shader.uniforms.uAlpha, adjust(Map.zoom, STYLE.zoomAlpha, 'zoom', 'alpha'));

    var normalMatrix = Matrix.invert3(Matrix.create());
    gl.uniformMatrix3fv(shader.uniforms.uNormalTransform, false, new Float32Array(Matrix.transpose(normalMatrix)));

    var
      dataItems = Data.items,
      item,
      matrix;

    for (var i = 0, il = dataItems.length; i < il; i++) {
      item = dataItems[i];

      if (!(matrix = item.getMatrix())) {
        continue;
      }

      matrix = Matrix.multiply(matrix, mapMatrix);

      gl.uniformMatrix4fv(shader.uniforms.uMatrix, false, new Float32Array(matrix));

      item.vertexBuffer.enable();
      gl.vertexAttribPointer(shader.attributes.aPosition, item.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

      item.normalBuffer.enable();
      gl.vertexAttribPointer(shader.attributes.aNormal, item.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

      item.colorBuffer.enable();
      gl.vertexAttribPointer(shader.attributes.aColor, item.colorBuffer.itemSize, gl.UNSIGNED_BYTE, true, 0, 0);

      item.scalesZBuffer.enable();
      gl.vertexAttribPointer(shader.attributes.aScaleZ, item.scalesZBuffer.itemSize, gl.FLOAT, true, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, item.vertexBuffer.numItems);
    }

    shader.end();
  };

}());
