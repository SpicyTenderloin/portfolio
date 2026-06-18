---
layout: default
title: Experience
heading: Experience
tagline: Where I've worked, led, and learned on the job.
permalink: /experience/
---

<section class="resume-section">
  <h2>Experience</h2>
  {% for job in site.data.experience %}
  <div class="resume-entry">
    {% if job.logo %}
    <div class="resume-logo-badge">
      <img src="{{ job.logo | relative_url }}" alt="{{ job.organization }} logo" class="resume-logo{% if job.logo_invert %} logo-invert{% endif %}">
    </div>
    {% endif %}
    <div class="resume-entry-content">
      <div class="resume-entry-header">
        <h3>{{ job.title }}<span class="resume-org"> · {{ job.organization }}</span></h3>
        <p class="resume-dates">{% if job.start and job.start != job.end %}{{ job.start }} – {% endif %}{{ job.end }}</p>
      </div>
      {% if job.bullets %}
      <ul>
        {% for bullet in job.bullets %}
        <li>{{ bullet }}</li>
        {% endfor %}
      </ul>
      {% endif %}
    </div>
  </div>
  {% endfor %}
</section>
