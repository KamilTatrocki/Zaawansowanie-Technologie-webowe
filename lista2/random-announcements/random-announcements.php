<?php
/**
 * Plugin Name: PHP IS DEAD
 * Description: Zadanie 1
 * Version: 1.0
 * Author: Kamil Tatrocki and Jacek Jeczeń (PHP IS DEAD)
 */

if (!defined('ABSPATH')) {
    exit; // Zabezpieczenie przed bezpośrednim dostępem
}

class Random_Announcements_Plugin {

    private $option_name = 'random_announcements_list';

    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_filter('the_content', array($this, 'prepend_announcement'));
    }

    public function add_admin_menu() {
        add_menu_page(
            'Losowe Ogłoszenia',       // Tytuł strony
            'Ogłoszenia',              // Nazwa w menu
            'manage_options',          // Wymagane uprawnienia
            'random-announcements',    // Slug strony
            array($this, 'settings_page_html'), // Funkcja wyświetlająca zawartość
            'dashicons-megaphone',     // Ikona w menu
            20                         // Pozycja w menu
        );
    }

    public function register_settings() {
        //wordpress zapisuje sam bezpieczine
        register_setting('random_announcements_group', $this->option_name);
    }

    public function settings_page_html() {
        if (!current_user_can('manage_options')) {
            return;
        }

        
        $announcements = get_option($this->option_name, array());
        if (!is_array($announcements)) {
            $announcements = array();
        }

        ?>
        <div class="wrap">
            <h1>Panel Ogłoszeń</h1>
            <p>Skonfiguruj listę ogłoszeń zapisanych w kodzie HTML. Wtyczka automatycznie wylosuje jedno z nich i doda je przed treścią każdego wpisu (między tytułem a treścią).</p>
            
            <form action="options.php" method="post">
                <?php
                settings_fields('random_announcements_group');
                ?>
                
                <div id="announcements-wrapper">
                    <?php
                    if (empty($announcements)) {
                        
                        $this->render_textarea('');
                    } else {
                        foreach ($announcements as $announcement) {
                            $this->render_textarea($announcement);
                        }
                    }
                    ?>
                </div>

                <p>
                    <button type="button" id="add-announcement" class="button">Dodaj kolejne ogłoszenie +</button>
                </p>

                <?php submit_button('Zapisz ogłoszenia'); ?>
            </form>
        </div>

        <script>
        document.addEventListener('DOMContentLoaded', function() {
            var wrapper = document.getElementById('announcements-wrapper');
            
            document.getElementById('add-announcement').addEventListener('click', function() {
                var div = document.createElement('div');
                div.className = 'announcement-item';
                div.style.marginBottom = '20px';
                div.style.padding = '15px';
                div.style.background = '#fff';
                div.style.border = '1px solid #ccd0d4';
                
                
                div.innerHTML = '<textarea name="<?php echo esc_js($this->option_name); ?>[]" rows="6" style="width:100%; font-family: monospace;" placeholder="Wprowadź kod HTML ogłoszenia..."></textarea><br>' + 
                                '<button type="button" class="button remove-announcement" style="margin-top: 10px; color: #b32d2e; border-color: #b32d2e;">Usuń ogłoszenie</button>';
                wrapper.appendChild(div);
            });

            
            wrapper.addEventListener('click', function(e) {
                if (e.target && e.target.classList.contains('remove-announcement')) {
                    e.target.parentElement.remove();
                }
            });
        });
        </script>
        <?php
    }


    private function render_textarea($content) {
        echo '<div class="announcement-item" style="margin-bottom: 20px; padding: 15px; background: #fff; border: 1px solid #ccd0d4;">';
        echo '<textarea name="' . esc_attr($this->option_name) . '[]" rows="6" style="width:100%; font-family: monospace;" placeholder="Wprowadź kod HTML ogłoszenia...">' . esc_textarea($content) . '</textarea><br>';
        echo '<button type="button" class="button remove-announcement" style="margin-top: 10px; color: #b32d2e; border-color: #b32d2e;">Usuń ogłoszenie</button>';
        echo '</div>';
    }

    public function prepend_announcement($content) {
        if (is_single() && is_main_query() && get_post_type() === 'post') {
            
            $announcements = get_option($this->option_name, array());
            $announcements = array_filter($announcements, function($val) {
                return trim($val) !== '';
            });

            if (!empty($announcements)) {
                $random_key = array_rand($announcements);
                $selected_announcement = $announcements[$random_key];

                $announcement_html = '<div class="random-announcement-container" style="margin-bottom: 25px;">';
                $announcement_html .= do_shortcode($selected_announcement); 
                $announcement_html .= '</div>';
                $content = $announcement_html . $content;
            }
        }

        return $content;
    }
}


new Random_Announcements_Plugin();
