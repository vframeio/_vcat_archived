import React from 'react';
import { site } from '../../util/site'

export default function Guide () {
  return (
    <div className="page-guide">
      <h1>Guide</h1>

      <p>VCAT (Visual Classification, Annotation, and Tagging) is web-based software to create machine learning image datasets.</p>

      <p>This VCAT instance is being used to create training datasets for the {site.client_name}</p>

      <h2>Intro</h2>

      <p>If you're reading this, you already have access to the {site.client_name}'s VCAT platform. As a contributor to VCAT, there are 3 basic tasks you do:</p>

      <ul>
        <li>Add/Edit Images</li>
        <li>Annotate Images</li>
        <li>Add Descriptive Image Metadata</li>
      </ul>

      <p>As an administrator you can also:</p>

      <ul>
        <li>Add/Edit New Categories</li>
      </ul>

      <h2>Add/Edit Images</h2>

      <p>Using Firefox, open the direct video file URL (to the MP4 file) and then right-click to "Save snapshot" on the frames containing the objects you want to detect.</p>

      <p>Click <code>Add Image</code> from the top menu bar and upload the image. By default the image will not be associated with any category</p>

      <p><img src="/static/docs/save-snapshot.jpg" alt="Save Snapshot As..." /></p>

      <p>Example of using FireFox right-click > "Save Snapshot As…" to save a video frame for VCAT.</p>
      
      <a name="image-quality"></a>
      <h2>Image Quality</h2>

      <p>Avoid using images that are pixellated or low resolution. Ideally images are 1280x720 pixels. For example, a full-frame snapshot from a YouTube video</p>

      <h2>Annotate Images</h2>
      
      <div className="columns">
        <div className="column col-6">
        <p><img className="img-responsive" src="/static/docs/annotation_correct.jpg" alt="Correct Annotation" /></p>
        </div>
        <div className="column col-6">
          <p><img className="img-responsive"  src="/static/docs/annotation_incorrect.jpg" alt="Incorrect Annotation" /></p>
        </div>
      </div>

      <p>When drawing the bounding boxes, annotate only the object with a tight bounding box. Inaccurately annotated training data will decrease the accuracy of the computer vision algorithms.</p>


      <h2>Add Descriptive Metadata</h2>

      <p>When you upload images to VCAT you can also contribute additional image metadata such as <code>tags</code>, <code>description</code>, and whether the image contains <code>graphic</code> content.</p>

      <p>Although optional, and slows down annotating images, adding descriptive data will help train future algorithms for scene and attribute detection</p>

      <p>You can also add any notes to the description that may be useful later in an investigation</p>

    </div>
  )
}
