using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Windows.Forms;

namespace BulkResizePhotos
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }

        private void browseButton_Click(object sender, EventArgs e)
        {
            // Show the folder browser dialog
            if (folderBrowserDialog.ShowDialog() == DialogResult.OK)
            {
                // Update the folder path text box
                folderPathTextBox.Text = folderBrowserDialog.SelectedPath;
            }
        }

        private void resizeButton_Click(object sender, EventArgs e)
        {
            // Get the folder path from the text box
            string folderPath = folderPathTextBox.Text;

            // Check if the folder path is valid
            if (!Directory.Exists(folderPath))
            {
                MessageBox.Show("Invalid folder path!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            // The maximum width and height of the resized photos
            int maxWidth = 800;
            int maxHeight = 600;

            // Get the files in the folder
            string[] files = Directory.GetFiles(folderPath);

            foreach (string file in files)
            {
                // Load the image from file
                using (Image image = Image.FromFile(file))
                {
                    // Calculate the new size of the image
                    int newWidth, newHeight;
                    if (image.Width > image.Height)
                    {
                        newWidth = maxWidth;
                        newHeight = (int)((double)image.Height / image.Width * maxWidth);
                    }
                    else
                    {
                        newHeight = maxHeight;
                        newWidth = (int)((double)image.Width / image.Height * maxHeight);
                    }

                    // Create a new bitmap with the new size
                    using (Bitmap bitmap = new Bitmap(image, newWidth, newHeight))
                    {
                        // Save the bitmap as JPEG with 90% quality
                        bitmap.Save(file, ImageFormat.Jpeg);
                    }
                }
            }

            MessageBox.Show("Bulk resize complete!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
    }
}
