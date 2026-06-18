---
layout: default
title: Experience
permalink: /experience/
---

<section class="resume-section">
  <h2>Experience</h2>
  {% for job in site.data.experience %}
  <div class="resume-entry">
    <div class="resume-entry-header">
      <h3>{{ job.title }}<span class="resume-org"> — {{ job.organization }}</span></h3>
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
  {% endfor %}
</section>
