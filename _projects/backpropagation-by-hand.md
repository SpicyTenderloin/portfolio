---
title: Backpropagation by Hand
description: A hand-worked numerical example of backpropagation through a small neural network, done to understand the mechanics behind how CNNs learn.
category: personal
status: "Completed"
thumbnail: /assets/img/backpropagation-by-hand/network-architecture-diagram.png
skills:
  - Machine Learning
  - Mathematics
---

**Task:** before trusting a deep learning framework's autograd, work through backpropagation by hand on a small, concrete network, to actually see how the gradient flows backward through each layer rather than taking it on faith. This came out of wanting a deeper understanding of how convolutional neural networks actually learn.

**Approach:** picked a small fully-connected network, a 4-element input, one 3-neuron hidden layer, a 2-element output, sigmoid activations throughout, with specific starting weights, biases, and a target output, then worked through the whole thing by hand: the forward pass (pre-activation and activation at each layer), the mean-squared-error loss, and then backpropagation itself, applying the chain rule layer by layer to get the gradient of the loss with respect to every weight and bias, finishing with the updated weights after one gradient-descent step.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/backpropagation-by-hand/network-architecture-diagram.png" | relative_url }}">
    <img src="{{ "/assets/img/backpropagation-by-hand/network-architecture-diagram.png" | relative_url }}" alt="Diagram of the small fully-connected network used for the worked example: a 4-element input, a 3-neuron hidden layer, and a 2-element output">
  </a>
  <figcaption>The small network used for the worked example: 4 inputs, one 3-neuron hidden layer, 2 outputs</figcaption>
</figure>

<div class="pdf-embed">
  <iframe src="{{ "/assets/pdf/backpropagation-by-hand/backprop-example-1-hidden-layer.pdf" | relative_url }}" title="Backpropagation by hand: forward pass and backpropagation derivation"></iframe>
</div>
<p class="pdf-embed-caption">Can't see the PDF? <a href="{{ "/assets/pdf/backpropagation-by-hand/backprop-example-1-hidden-layer.pdf" | relative_url }}">Open it directly</a>.</p>

**Outcome:** a complete, numerically worked backpropagation example, from forward pass through to updated weights, that ties every term in the chain rule (the output error, the sigmoid derivative, the upstream weight matrix) to an actual number rather than an abstract symbol. That concrete grounding is what made the same mechanism click later when applied to a CNN's convolutional layers.
